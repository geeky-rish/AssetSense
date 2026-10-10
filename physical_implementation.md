# AssetSense Physical Implementation Guide

This guide details how to integrate real hardware sensors with the AssetSense dashboard.

## 🛠 Hardware Bill of Materials

| Component | Function | Dashboard Field | Unit |
|-----------|----------|-----------------|------|
| **ESP32** | Main Microcontroller (WiFi + Processing) | N/A | N/A |
| **MPU6050** | Accelerometer & Gyroscope | `vib` | g (acceleration) |
| **ACS712** | Current Sensor (Hall Effect) | `current` | Amps (A) |
| **DS18B20** | Waterproof Temperature Sensor | `temp` | Celsius (°C) |

## 🔌 Wiring Diagram (Conceptual)

### 1. MPU6050 (I2C) - Vibration
*   **VCC** -> 3.3V
*   **GND** -> GND
*   **SCL** -> GPIO 22
*   **SDA** -> GPIO 21

### 2. ACS712 (Analog) - Current
*   **VCC** -> 5V (Note: Output is 5V logic, use voltage divider if connecting to 3.3V pin, or use 3.3V compatible sensor like ACS712-3.3V version if available. Standard ACS712 needs 5V but ESP32 ADC can only handle up to 3.3V carefully.)
    *   *Safe approach:* Use specific ESP32 compatible current sensors or a voltage divider on the output pin (OUT -> 2kΩ -> ADC pin -> 3kΩ -> GND).
*   **GND** -> GND
*   **OUT** -> GPIO 34 (Analog Input)

### 3. DS18B20 (OneWire) - Temperature
*   **VCC** -> 3.3V or 5V
*   **GND** -> GND
*   **DATA** -> GPIO 4
*   *Note:* Requires a 4.7kΩ pull-up resistor between VCC and DATA.

---

## 📡 Data Fields Required

To drive the **NodeGrid** and **Analytics** components, your ESP32 should stream a JSON payload structure containing these core fields:

```json
{
  "nodeId": "node-001",       // Unique Identifier
  "temp": 42.5,               // Temperature in °C
  "vib": 0.15,                // Vibration in 'g' (RMS or Peak)
  "current": 8.4,             // Current in Amps
  "status": "healthy",        // Optional: Can be calculated on server
  "health": 98.5              // Optional: Can be calculated on server
}
```

### 1. Vibration (`vib`)
*   **Source**: MPU6050
*   **Raw Data**: Accelerometer X, Y, Z raw values.
*   **Processing**:
    1.  Read X, Y, Z acceleration.
    2.  Convert to 'g' force (usually raw / 16384.0 for ±2g range).
    3.  Calculate **Magnitude**: $A = \sqrt{x^2 + y^2 + z^2}$
    4.  Remove gravity (approx 1.0g) or use a high-pass filter.
    5.  Calculate **RMS (Root Mean Square)** over a sample window (e.g., 100 samples).
    *   **Dashboard Expectation**: A float value typically between `0.00` and `5.00` g.
    *   *Healthy*: < 0.5g
    *   *Warning*: 0.5g - 1.5g
    *   *Critical*: > 1.5g

### 2. Current (`current`)
*   **Source**: ACS712
*   **Raw Data**: Analog voltage (0-4095 on ESP32).
*   **Processing**:
    1.  Read Analog value (avg of 1000 samples to reduce noise).
    2.  Convert to Voltage: $Voltage = (ADC\_Value / 4095.0) * 3.3V$
    3.  Convert to Amps: $Amps = (Voltage - Offset) / Sensitivity$
        *   *Sensitivity*: 185mV/A (5A model), 100mV/A (20A model), 66mV/A (30A model).
        *   *Offset*: Typically VCC/2 (2.5V for 5V supply).
    *   **Dashboard Expectation**: Float value (e.g., `12.5` A).

### 3. Temperature (`temp`)
*   **Source**: DS18B20
*   **Raw Data**: Digital Celsius reading.
*   **Processing**: Direct read using `OneWire` and `DallasTemperature` libraries.
*   **Dashboard Expectation**: Float value (e.g., `65.2` °C).

---

## 💻 ESP32 Code Snippet (Arduino Framework)

This is a simplified example to get the specific fields needed.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// --- Config ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASS";
const char* serverUrl = "http://YOUR_PC_IP:3000/api/sensor-data";

// --- Pins ---
#define PIN_DS18B20 4
#define PIN_CURRENT 34

// --- Objects ---
OneWire oneWire(PIN_DS18B20);
DallasTemperature sensors(&oneWire);
Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  // Init Sensors
  sensors.begin();
  if (!mpu.begin()) {
    Serial.println("MPU6050 not found!");
    while (1);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
}

// Function to calculate Vibration RMS
float getVibrationRMS() {
    int samples = 50;
    float sumSquares = 0;
    for (int i = 0; i < samples; i++) {
        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);
        
        // Remove gravity approx (simple method)
        float accMag = sqrt(pow(a.acceleration.x, 2) + pow(a.acceleration.y, 2) + pow(a.acceleration.z, 2));
        float vib = abs(accMag - 9.81); // 9.81 m/s^2 is gravity
        
        sumSquares += (vib * vib);
        delay(2);
    }
    // Return in 'g' (divide by 9.81)
    return sqrt(sumSquares / samples) / 9.81;
}

float getCurrent() {
    // Basic ACS712 logic (requires calibration!)
    int raw = analogRead(PIN_CURRENT);
    float voltage = (raw / 4095.0) * 3.3; 
    // Example only - Adjust sensitivity and zero point for your module/voltage divider
    return abs((voltage - 2.5) / 0.185); 
}

void loop() {
  // 1. Read Temp
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  // 2. Read Vib
  float vibG = getVibrationRMS();

  // 3. Read Current
  float currentA = getCurrent();

  // 4. Create JSON (Simple Construction)
  String json = "{";
  json += "\"nodeId\": \"pump-01\",";
  json += "\"temp\": " + String(tempC) + ",";
  json += "\"vib\": " + String(vibG) + ",";
  json += "\"current\": " + String(currentA);
  json += "}";

  // 5. Send to Dashboard
  if(WiFi.status() == WL_CONNECTED){
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(json);
      http.end();
  }

  delay(2000);
}
```

## 🔗 Integration with Frontend

In your React frontend (`src/components/NodeGrid.jsx`), the incoming data maps directly:

| JSON Field | Component Prop | Display Logic |
|------------|----------------|---------------|
| `temp` | `node.temp` | `{node.temp.toFixed(1)}` |
| `vib` | `node.vib` | `{node.vib.toFixed(2)}` |
| `current` | `node.current` | `{node.current.toFixed(1)}` |

The **Health Index** and **Status** (`healthy`, `warning`, `critical`) should ideally be calculated based on thresholds relative to these raw values.
