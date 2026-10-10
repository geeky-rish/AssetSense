# AssetSense

AssetSense is a prototype industrial monitoring application for tracking equipment health from temperature, vibration, and current readings. It combines a React dashboard with a Node.js service that consumes MQTT telemetry, enriches readings with health and fault estimates, stores readings, and broadcasts updates to connected clients.

The repository includes a simulator-driven workflow as well as an ESP32 sketch for sending sensor data. It is intended for development, demonstrations, and further engineering work rather than direct deployment to safety-critical equipment.

## What it does

- Displays live equipment status and sensor values in a React dashboard.
- Estimates health, remaining useful life, anomaly score, and likely fault type.
- Supports fault injection and repair from the dashboard for simulation.
- Switches to a standby node when an active node reaches the critical health threshold.
- Publishes enriched readings to the frontend over Socket.IO.
- Sends optional email alerts for critical readings.
- Persists data to MongoDB when available and falls back to `db-logs.json`.

## Architecture

```text
ESP32 or simulator
        |
        v
  MQTT broker (assetsense/nodes/#)
        |
        v
Node.js service
  |       |       \
  |       |        \-- MongoDB or db-logs.json
  |       \----------- Socket.IO
  \------------------ Email alerts (optional)
          |
          v
    React + Vite dashboard
```

The backend subscribes to `assetsense/nodes/#`. A telemetry message should contain at least `nodeId`, `temp`, `vib`, and `current`:

```json
{
  "nodeId": "pump-01",
  "temp": 64.2,
  "vib": 0.35,
  "current": 7.8,
  "timestamp": 1248950
}
```

## Repository layout

```text
.
├── code/code_1/code_1.ino       ESP32 sensor and MQTT sketch
├── public/                       Static frontend assets
├── server/
│   ├── index.js                  HTTP, MQTT, Socket.IO, and alert service
│   ├── mlModel.js                Health and anomaly calculations
│   ├── database.js               MongoDB and JSON persistence
│   ├── verify_analytics.js       Offline analytics verification
│   └── verify_mqtt.js            MQTT publish smoke test
├── src/
│   ├── App.jsx                   Application shell and view routing
│   ├── components/               Dashboard components
│   ├── hooks/                    Client-side simulation and socket state
│   └── styles/                   Application styles
├── physical_implementation.md   Hardware wiring notes
├── system_architecture.puml     PlantUML architecture source
└── end_to_end_workflow.md       Detailed data-flow notes
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB is optional; the service uses a local JSON file when MongoDB is unavailable
- Arduino IDE is optional and only needed for the ESP32 workflow

## Getting started

Clone the repository and install both dependency sets:

```bash
git clone https://github.com/geeky-rish/assetsense.git
cd assetsense
npm install
cd server
npm install
cd ..
```

Create a `.env` file in the repository root when you need custom configuration:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/assetsense
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

`MONGO_URL`, `EMAIL_USER`, and `EMAIL_PASS` are optional for local dashboard work. Never commit credentials or app passwords.

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal from the repository root:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The backend listens on port `3000` by default and connects to the public MQTT broker configured in `server/index.js`. For production or shared environments, configure a broker with authentication and TLS before using real equipment.

## Configuration and data flow

The backend loads `.env` from the repository root. Critical readings are evaluated when health falls below 60%. Alerts are throttled per node, with a five-minute cooldown. Email delivery is disabled unless both SMTP environment variables are present.

The frontend receives enriched `sensor_update` events over Socket.IO. A typical event contains:

```json
{
  "nodeId": "pump-01",
  "temp": 64.2,
  "vib": 0.35,
  "current": 7.8,
  "health": 98.4,
  "status": "healthy",
  "fault": "None",
  "rul": 1000,
  "anomalyScore": 0.12,
  "isAnomaly": false,
  "mlConfidence": 0.94,
  "predictionSource": "ML (Neural Net)"
}
```

## API

### Send an alert

`POST /api/send-alert`

Request body:

```json
{
  "nodeName": "Induction Motor",
  "health": 55.4,
  "temp": 86.2,
  "vib": 2.45,
  "current": 12.8,
  "fault": "Bearing Wear"
}
```

Successful requests return:

```json
{
  "success": true
}
```

### MQTT

- Topic: `assetsense/nodes/{nodeId}`
- Subscription: `assetsense/nodes/#`
- Socket.IO event: `sensor_update`

## Testing and checks

Run the frontend lint and production build from the repository root:

```bash
npm run lint
npm run build
```

Run the backend analytics verification:

```bash
cd server
node verify_analytics.js
```

To publish one sample MQTT message to the configured broker:

```bash
node verify_mqtt.js
```

## Hardware workflow

The ESP32 sketch is in `code/code_1/code_1.ino`. Update the Wi-Fi credentials, MQTT broker settings, and sensor wiring for the target setup before flashing it. See [physical_implementation.md](physical_implementation.md) for the current wiring notes.

## Deployment notes

Build the frontend with:

```bash
npm run build
```

Serve the generated `dist/` directory with a static host. Run the backend with `npm start` from `server/` under a process manager such as PM2. Before exposing the service, replace the public MQTT connection, restrict CORS, secure MongoDB, and provide SMTP credentials through the deployment environment.

## Contributing

1. Create a focused branch for the change.
2. Install dependencies in both the root and `server/` directories.
3. Run `npm run lint`, `npm run build`, and the relevant backend verification script.
4. Open a pull request describing the behavior changed and how it was tested.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) when the license file is present in the repository.

## Contact

**Rishi Kulkarni**  
GitHub: [@geeky-rish](https://github.com/geeky-rish)  
Queries and issues: [hello.rishikulkarni@gmail.com](mailto:hello.rishikulkarni@gmail.com)
