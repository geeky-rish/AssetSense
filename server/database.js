import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Mongoose Schema
const readingSchema = new mongoose.Schema({
    nodeId: String,
    temp: Number,
    vib: Number,
    current: Number,
    health: Number,
    fault: String,
    anomalyScore: Number,
    predictionSource: String,
    timestamp: { type: Date, default: Date.now }
});

const alertSchema = new mongoose.Schema({
    nodeId: String,
    level: String, // WARNING, CRITICAL
    type: String, // Fault Type
    message: String,
    acknowledged: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

let SensorReading;
let Alert;
let isMongoConnected = false;
const JSON_DB_PATH = path.resolve('./db-logs.json');

export class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        // Try connecting to standard local Mongo port
        const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/assetsense';

        try {
            console.log(`💾 Database: Attempting connection to ${mongoUrl}...`);
            await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 2000 });
            isMongoConnected = true;

            SensorReading = mongoose.model('SensorReading', readingSchema);
            Alert = mongoose.model('Alert', alertSchema);

            console.log('✅ Database: MongoDB Connected Successfully.');
        } catch (err) {
            console.warn('⚠️ Database: MongoDB connection failed (missing or unreachable).');
            console.warn('⚠️ Database: Falling back to JSON File Persistence (db-logs.json).');
            isMongoConnected = false;

            // Init JSON file if not exists
            if (!fs.existsSync(JSON_DB_PATH)) {
                fs.writeFileSync(JSON_DB_PATH, JSON.stringify([], null, 2));
            }
        }
    }

    async saveReading(data) {
        if (isMongoConnected) {
            try {
                await SensorReading.create(data);
            } catch (e) {
                console.error('DB Error:', e.message);
            }
        } else {
            // Append to file (simple robust approach: read, push, write - acceptable for prototype scale)
            // For higher perf, we would append line-by-line (NDJSON)
            try {
                // Using APPEND mode with NDJSON format for performance (safer than reading whole file)
                const entry = JSON.stringify({ ...data, timestamp: new Date() }) + '\n';
                fs.appendFileSync(JSON_DB_PATH, entry);
            } catch (e) {
                console.error('DB File Error:', e.message);
            }
        }
    }

    async saveAlert(data) {
        // Same logic for alerts (could store in separate file, but using same logic for now)
        if (isMongoConnected) {
            try {
                await Alert.create(data);
            } catch (e) { console.error('DB Error:', e.message); }
        } else {
            try {
                const entry = JSON.stringify({ ...data, type: 'ALERT', timestamp: new Date() }) + '\n';
                fs.appendFileSync(JSON_DB_PATH, entry);
            } catch (e) { console.error('DB File Error:', e.message); }
        }
    }
}

export const db = new Database();
