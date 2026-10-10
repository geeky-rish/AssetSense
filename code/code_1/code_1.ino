#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <MPU6050.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <math.h>

/* ================= WIFI ================= */
#define WIFI_SSID     "sneha"
#define WIFI_PASSWORD "sneha@1501"

/* ================= MQTT ================= */
#define MQTT_BROKER   "broker.hivemq.com"
#define MQTT_PORT     1883
#define MQTT_TOPIC    "assetsense/nodes/pump-01"
#define NODE_ID       "pump-01"

/* ================= MPU6050 ================= */
MPU6050 mpu;

/* ================= DS18B20 ================= */
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

/* ================= ACS712 ================= */
#define CURRENT_PIN 34
#define ADC_MAX 4095.0
#define VREF 3.3
#define ACS_SENSITIVITY 0.100   // 20A version

float currentOffset = 0.0;

/* ================= NETWORK ================= */
WiFiClient espClient;
PubSubClient mqttClient(espClient);

/* ================= FUNCTIONS ================= */

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void connectMQTT() {
  if (mqttClient.connected()) return;

  Serial.print("Connecting to MQTT...");
  if (mqttClient.connect(NODE_ID)) {
    Serial.println("connected");
  } else {
    Serial.print("failed, rc=");
    Serial.println(mqttClient.state());
  }
}

/* -------- VIBRATION RMS (g) -------- */
float getVibrationRMS() {
  const int samples = 50;
  float sumSq = 0;

  for (int i = 0; i < samples; i++) {
    int16_t ax, ay, az;
    mpu.getAcceleration(&ax, &ay, &az);

    float axg = ax / 16384.0;
    float ayg = ay / 16384.0;
    float azg = az / 16384.0;

    float mag = sqrt(axg*axg + ayg*ayg + azg*azg);
    float vib = fabs(mag - 1.0);

    sumSq += vib * vib;
    delay(2);
  }
  return sqrt(sumSq / samples);
}

/* -------- CURRENT (DC) -------- */
float readCurrent() {
  const int samples = 100;
  long sum = 0;

  for (int i = 0; i < samples; i++) {
    sum += analogRead(CURRENT_PIN);
    delay(1);
  }

  float adc = sum / (float)samples;
  float voltage = (adc / ADC_MAX) * VREF;
  float current = (voltage - currentOffset) / ACS_SENSITIVITY;

  if (fabs(current) < 0.05) current = 0;
  return fabs(current);
}

/* ================= SETUP ================= */
void setup() {
  Serial.begin(115200);
  delay(1000);

  /* ---- I2C ---- */
  Wire.begin(21, 22);
  Wire.setClock(100000);

  /* ---- MPU6050 RESET ---- */
  Wire.beginTransmission(0x68);
  Wire.write(0x6B);
  Wire.write(0x80);
  Wire.endTransmission();
  delay(100);

  Wire.beginTransmission(0x68);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission();
  delay(100);

  mpu.initialize();
  Serial.println("MPU6050 ready");

  /* ---- DS18B20 ---- */
  tempSensor.begin();
  Serial.println("DS18B20 ready");

  /* ---- ADC ---- */
  analogReadResolution(12);
  analogSetPinAttenuation(CURRENT_PIN, ADC_11db);

  /* ---- CURRENT CALIBRATION (NO LOAD) ---- */
  Serial.println("Calibrating current sensor (NO LOAD)...");
  long calSum = 0;
  for (int i = 0; i < 200; i++) {
    calSum += analogRead(CURRENT_PIN);
    delay(2);
  }
  currentOffset = (calSum / 200.0) / ADC_MAX * VREF;
  Serial.print("Current offset = ");
  Serial.println(currentOffset, 3);

  /* ---- NETWORK ---- */
  connectWiFi();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
}

/* ================= LOOP ================= */
void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();

  /* ---- TEMP ---- */
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);

  /* ---- VIB ---- */
  float vibG = getVibrationRMS();

  /* ---- CURRENT ---- */
  float currentA = readCurrent();

  /* ---- JSON ---- */
  StaticJsonDocument<256> doc;
  doc["nodeId"] = NODE_ID;
  doc["temp"] = tempC;
  doc["vib"] = vibG;
  doc["current"] = currentA;
  doc["timestamp"] = millis();

  char payload[256];
  serializeJson(doc, payload);

  mqttClient.publish(MQTT_TOPIC, payload);

  Serial.println(payload);
  delay(2000);
}