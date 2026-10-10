# AssetSense: Industrial IoT Predictive Maintenance System
*Technical Documentation & Operational Manual*

---

## 1. Context & Value Proposition

### 1.1. The Challenge: Unplanned Downtime
In industrial settings (manufacturing, oil & gas, energy), **unplanned equipment failure** is the single largest driver of lost revenue. Reactive maintenance (fixing things after they break) leads to expensive repairs and dangerous safety incidents. Traditional "preventative" maintenance (scheduled repairs) is inefficient, often replacing healthy parts unnecessarily.

### 1.2. What is Predictive Maintenance?
**Predictive Maintenance (PdM)** is a condition-based monitoring strategy that uses sensor data, statistical models, and machine learning to estimate when equipment is likely to fail, allowing maintenance to be performed exactly when needed.

### 1.3. The Solution: AssetSense
**AssetSense** bridges the gap between raw sensor data and actionable decision-making. By leveraging PdM principles, it monitors asset health in real-time, predicts failures before they occur, and automates safety responses.

**Key Value Drivers:**
*   **Reduced Downtime:** Identify degrading assets (e.g., "Bearing Wear") weeks before catastrophic failure.
*   **Operational Safety:** Automated "Auto-Protect" protocols isolate critical faults instantly.
*   **Data-Driven Decisions:** Transition from "gut feeling" to quantifiable Health Scores and RUL (Remaining Useful Life) metrics.

---

## 2. Technical Architecture & Industry 4.0 Alignment

AssetSense mimics elements typically found in **SCADA and DCS monitoring layers**, especially **Level 2 (supervisory control)** and **Level 3 (operations management)**, designed as a cloud-native capability demonstration.

| Layer | Component | Function in AssetSense |
| :--- | :--- | :--- |
| **Edge / Physical** | **Simulation Engine** | Generates high-fidelity signal data mimicking physical sensors. |
| **Communication** | **Virtual Pub/Sub** | An internal state bus that behaves like MQTT (telemetry transmission), but does not require an actual broker. |
| **Logic / Processing** | **ML Inference** | Real-time analysis of incoming streams to compute Health Scores and RUL. |
| **Presentation** | **React Dashboard** | A "Single Pane of Glass" for operators to monitor fleets and drill down into root causes. |

**System Pipeline Overview:**
> AssetSense operates as a complete PdM pipeline: **Data Simulation → Feature Extraction → Health Scoring → Fault Classification → RUL Prediction → Auto-Protect Logic → Visualization.**

---

## 3. Core Simulation Engine: Stochastic Physics Modeling

Unlike static demos, AssetSense is powered by a **Stochastic Physics Engine** (`useSimulation.js`) that models thermodynamic and mechanical properties of industrial assets.

### 3.1. Stochastic Process Generation
The system does not just loop pre-recorded data. It generates unique time-series data using:
*   **Random Walk Processes:** `X_t = X_{t-1} + ε` (where `ε` is Gaussian noise).
*   **Physics Constrained Variance:** Vibration impacts bearing temperature; Electrical load impacts winding temperature.
*   **Drift Modeling:** Simulates component degradation over time (linear vs exponential decay).

**Sensor Units:**
*   **Temperature:** (°C)
*   **Vibration:** (mm/s RMS)
*   **Current:** (A)

### 3.2. Simulation Accuracy & Fidelity
To ensure scientific realism, the simulation enforces:
*   **Thermal Inertia:** Temperature does not jump instantly; it ramps up over seconds/minutes.
*   **Cross-Coupling:** A "Misalignment" fault causes *both* Vibration peaks and Temperature rises, respecting physical causality.
*   **Signal-to-Noise Ratio (SNR):** Raw sensor data includes realistic noise floor, requiring the system to filter for trend detection.

---

## 4. The Role of Machine Learning & Heuristics

AssetSense employs a hybrid **Rule-Based + Heuristic Scoring** engine to mimic Edge AI deployment.

> **Note:** The "ML model" implemented here is a lightweight **heuristic scoring model** inspired by regression-based condition monitoring techniques. It is intentionally simple to allow real-time edge execution without heavy dependency on pre-trained datasets.

### 4.1. Health Scoring Algorithm
The "Health Score" (0-100%) is a composite metric derived from normalized sensor deviations.
```math
Health = 100 - (w_T \cdot \Delta T + w_V \cdot \Delta V + w_A \cdot \Delta A)
```
*   **Sensors:** T (Temperature), V (Vibration), A (Amperage).
*   **Weights (w):** Tuned coefficients based on asset criticality (e.g., Vibration is weighted higher for rotating machinery).

### 4.2. Fault Classification Logic
The system uses multi-parametric thresholding to classify root causes:

| Detected Pattern | Probable Fault Classification |
| :--- | :--- |
| **↑ Temp (>80°C)** + **↑ Vib (>2.0 mm/s)** | **Bearing Wear** (Friction-induced heat/instability) |
| **↑ Temp (>85°C)** + **↑ Current (>12A)** | **Overload** (Motor straining against load) |
| **↑ Vib (>2.5 mm/s)** (Isolated) | **Misalignment** (Shaft/Coupling issue) |
| **↑ Temp (>90°C)** (Isolated) | **Overheating** (Cooling failure/Environment) |

### 4.3. Remaining Useful Life (RUL) Prediction
RUL is calculated using a **Linear Degradation Model**.
*   **Normal Operation:** `Decay Rate ≈ 0.01 units/sec`
*   **Fault Condition:** `Decay Rate ≈ 0.05 units/sec` (Accelerated Aging)
*   **Purpose:** Helps maintenance teams schedule repairs *exactly* when needed, optimizing spare part inventory.

---

## 5. Multi-Node Coordination & Auto-Protect

A critical feature of AssetSense is the **System-Level Control Logic**, demonstrating how individual asset data drives plant-wide decisions.

### 5.1. The "Auto-Protect" Workflow
1.  **Surveillance:** The system monitors all active nodes continuously (1Hz tick rate).
2.  **Trigger:** Node A sends a `CRITICAL` status heartbeat (Health < 60%).
3.  **Logic Check:** The System Controller identifies Node A as **Non-Spare** and **Active**.
4.  **Intervention:**
    *   **Step 1:** Send `SHUTDOWN` command to Node A (Deactivate).
    *   **Step 2:** Send `STARTUP` command to Spare Node (Activate).
    *   **Step 3:** Log event `[CRITICAL] Auto-Protect: Switched Node A to Spare`.

> **Safety Note:** This feature demonstrates how industrial systems ensure **operational resilience** through redundancy, preventing total plant shutdown.

---

## 6. User Interface: Decision Support System

The UI is designed not just to *show* data, but to *guide* decisions.

*   **KPI Banner:** Immediate situational awareness (System Health, Active Alerts).
*   **Ranking Panel:** Sorting by "Lowest Health" focuses operator attention on the "Worst Actor" first (Pareto Principle).
*   **Data Comparison:** Overlaying historical traces (e.g., Temp vs Current) allows engineers to correlate variables for root cause analysis.
*   **Fault Control Panel:** A digital twin interface for operators to simulate "What-If" scenarios (e.g., "What happens if Pump 01 misaligns?").

---

## 7. Email Alert Integration (New Feature)

To close the loop between detection and action, AssetSense includes an **Automated Email Notification System**.

### 7.1. Trigger Logic
*   **Condition:** Health Score < 60% (Critical)
*   **Idempotency:** Emails are sent *once* per critical event. If the node fluctuates (e.g., 59% -> 61% -> 59%), the system waits for a full recovery (>70%) before re-arming the trigger to prevent spam.

### 7.2. Architecture
*   **Frontend Service:** `emailService.js` captures the "Alert Packet" (full diagnostic snapshot).
*   **Backend Relay:** A local Node.js/Express server (`/api/send-alert`) securely handles SMTP credentials.
*   **Presentation:** Alerts in the dashboard are tagged with an "Email Sent" badge for auditability.

---

## 8. Future Roadmap & Expansion

To evolve AssetSense into a production-grade industrial platform:

*   **❌ MQTT / OPC-UA Integration:** Replace the internal simulation with real-time WebSocket ingestion from industrial gateways (e.g., HiveMQ, Kepware).
*   **❌ Digital Twin Visualization:** Import 3D CAD models (Three.js) to visualize thermal gradients on the actual asset mesh.
*   **❌ Edge Computing:** Port the logic layer (`Health Scoring`) to Python/C++ for deployment on Edge Gateways (Raspberry Pi/Industrial PC).
*   **❌ Federated Learning:** Use data from multiple plants to train a more robust global anomaly detection model.

---

> **Disclaimer:** All values, thresholds, and degradation rates used in AssetSense are simulated approximations designed for demonstration and educational purposes.

This document outlines the operational theory and technical foundation of AssetSense, validating its position as a sophisticated **Industrial 4.0** demonstration platform.
