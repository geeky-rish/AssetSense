
import { MLModel } from './mlModel.js';

console.log('--- AssetSense Cloud Analytics Verification ---');

const model = new MLModel();

// 1. Train with Normal Data (Healthy state) - wider variance for realism
console.log('\n[1] Training with Normal Data (Temp=40, Vib=0.5, Curr=5)...');
for (let i = 0; i < 100; i++) {
    const t = 40 + (Math.random() - 0.5) * 5; // +/- 2.5 degrees
    const v = 0.5 + (Math.random() - 0.5) * 0.2; // +/- 0.1 g
    const c = 5 + (Math.random() - 0.5) * 2; // +/- 1 A
    model.predictHealth(t, v, c);
}

const status = model.getStatus();
console.log('Model Status:', status);

// 2. Test Normal Point
console.log('\n[2] Testing Normal Point (Temp=41, Vib=0.55, Curr=5.2)...');
const normalResult = model.predictHealth(41, 0.55, 5.2);
console.log('Normal Result:', JSON.stringify(normalResult, null, 2));

if (normalResult.health > 90) {
    console.log('✅ PASS: Normal data health high.');
} else {
    console.error('❌ FAIL: Normal data low health.');
}

// 3. Test Anomaly Point (High Vibration - Misalignment)
console.log('\n[3] Testing Anomaly Point (Temp=45, Vib=3.5, Curr=5.5)...');
model.predictHealth(45, 3.5, 5.5); // Feed once to bias EWMA
const anomalyResult = model.predictHealth(45, 3.5, 5.5);
console.log('AnomalyResult (Score):', anomalyResult.anomalyScore);

if (anomalyResult.isAnomaly === true) {
    console.log('✅ PASS: Anomaly detected (Isolation Forest Score > 0.55).');
} else {
    console.error('❌ FAIL: Anomaly NOT detected.');
}

// 4. Test Health Score Penalty (High Temp) - Feed SUSTAINED fault
console.log('\n[4] Testing Health Penalty (Temp=90, Vib=0.5, Curr=5) - Sustained...');
let criticalResult;
for (let k = 0; k < 10; k++) {
    criticalResult = model.predictHealth(90, 0.5, 5);
}
console.log('Critical Result:', JSON.stringify(criticalResult, null, 2));

// Expecting < 80 (Warning) because Temp weight is only 0.3 (Max drop 30%)
if (criticalResult.health < 80) {
    console.log('✅ PASS: Health score penalized correctly (< 80).');
} else {
    console.error('❌ FAIL: Health score not penalized enough.');
}
