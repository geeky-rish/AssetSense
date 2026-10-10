/**
 * AssetSense ML Model - Cloud Analytics Layer (PRO VERSION)
 * Implements "Section VI.C: Cloud Analytics and Fleet Intelligence" from IOT_paper.pdf
 * 
 * Algorithms:
 * 1. Drift Estimation: Exponentially Weighted Moving Average (EWMA) [Eq. 4]
 * 2. Anomaly Detection: Isolation Forest (Unsupervised) [Section VI.C.2]
 * 3. Health Scoring: Sigmoid-based Penalty Function [Eq. 5 & 6]
 * 4. Fault Classification: Feedforward Neural Network (Brain.js) [Section III.C]
 * 5. RUL Estimation: Linear Trend Regression (Simple-Statistics) [Eq. 7]
 */

import brain from 'brain.js';
import * as ss from 'simple-statistics';

const CONFIG = {
    // EWMA Parameters
    ewma: {
        alphaBase: 0.1,    // Baseline smoothing factor
        alphaDynamic: true // Adjust alpha based on volatility
    },

    // Health Penalty Weights (from Paper)
    weights: {
        vib: 0.5,
        temp: 0.3,
        current: 0.2
    },

    // Soft Thresholds for Sigmoid Function (Tau_k)
    thresholds: {
        vib: 2.5,    // mm/s (mapped from g for simulation)
        temp: 75,    // °C
        current: 12  // A
    },

    // Sensitivity Parameters (Lambda_k)
    sensitivity: {
        vib: 2.0,
        temp: 0.25,
        current: 0.5
    },

    // RUL Parameters
    rul: {
        historySize: 50,      // Number of points to keep for degradation analysis
        criticalHealth: 20    // Health score considered "failure"
    }
};

// ==========================================
// 1. ISOLATION FOREST IMPLEMENTATION (Unsupervised Anomaly)
// ==========================================
// (Using previous lightweight implementation for speed vs importing heavy libs)

class IsolationTree {
    constructor(heightLimit) {
        this.heightLimit = heightLimit;
        this.root = null;
    }

    fit(X) {
        this.root = this.makeTree(X, 0, this.heightLimit);
    }

    makeTree(X, currentHeight, heightLimit) {
        if (currentHeight >= heightLimit || X.length <= 1) {
            return { type: 'leaf', size: X.length };
        }

        const numFeatures = X[0].length;
        const q = Math.floor(Math.random() * numFeatures);
        const values = X.map(x => x[q]);
        const min = Math.min(...values);
        const max = Math.max(...values);

        if (min === max) return { type: 'leaf', size: X.length };

        const p = min + Math.random() * (max - min);
        const leftX = X.filter(x => x[q] < p);
        const rightX = X.filter(x => x[q] >= p);

        return {
            type: 'node',
            splitAtt: q,
            splitVal: p,
            left: this.makeTree(leftX, currentHeight + 1, heightLimit),
            right: this.makeTree(rightX, currentHeight + 1, heightLimit)
        };
    }

    pathLength(x, node, currentHeight) {
        if (node.type === 'leaf') return currentHeight + this.c(node.size);
        if (x[node.splitAtt] < node.splitVal) return this.pathLength(x, node.left, currentHeight + 1);
        return this.pathLength(x, node.right, currentHeight + 1);
    }

    c(n) {
        if (n <= 1) return 0;
        return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
    }
}

class IsolationForest {
    constructor(numTrees = 20, sampleSize = 256) {
        this.numTrees = numTrees;
        this.sampleSize = sampleSize;
        this.trees = [];
        this.X_train = [];
    }

    train(dataPoint) {
        this.X_train.push(dataPoint);
        if (this.X_train.length > this.sampleSize * 2) this.X_train.shift();

        if (this.trees.length === 0 && this.X_train.length >= 10) {
            this.buildForest();
        } else if (this.X_train.length % 50 === 0) {
            this.buildForest();
        }
    }

    buildForest() {
        this.trees = [];
        const heightLimit = Math.ceil(Math.log2(this.sampleSize));
        const sample = this.X_train.length > this.sampleSize ? this.X_train.slice(-this.sampleSize) : this.X_train;

        for (let i = 0; i < this.numTrees; i++) {
            const tree = new IsolationTree(heightLimit);
            tree.fit(sample);
            this.trees.push(tree);
        }
    }

    score(x) {
        if (this.trees.length === 0) return 0.5;
        let totalPathLength = 0;
        for (let tree of this.trees) totalPathLength += tree.pathLength(x, tree.root, 0);
        const avgPathLength = totalPathLength / this.trees.length;
        const n = this.sampleSize;
        const c_n = 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
        return Math.pow(2, -avgPathLength / c_n);
    }
}

// ==========================================
// 2. MAIN MODEL CLASS
// ==========================================

export class MLModel {
    constructor() {
        console.log('🧠 AssetSense Cloud Analytics: Initializing (PRO VERSION)...');

        // A. Anomaly Detection
        this.isolationForest = new IsolationForest(25, 100);

        // B. Neural Network Classifier (Brain.js)
        this.net = new brain.NeuralNetwork({
            hiddenLayers: [64, 32], // Matches paper description
            activation: 'sigmoid'
        });

        // Initialize with basic knowledge (Synthetic training for startup)
        this.trainInitialNetwork();

        // C. EWMA State
        this.driftState = {
            temp: { mean: 40, var: 0 },
            vib: { mean: 0.5, var: 0 },
            current: { mean: 5, var: 0 }
        };

        // D. RUL History (Per Node - Map<NodeID, Array<HealthScore>>)
        // Since MLModel is singleton but shared, we usually need node context.
        // For simplicity, we'll store a map of histories keyed by "default" or need NodeID passed in predict.
        // We will assume single stream or reset for now, but better to use a Map.
        this.nodeHistories = new Map();

        this.trainingCount = 0;
        console.log('🧠 AssetSense Cloud Analytics: Online (NN + Forest + Regression)');
    }

    trainInitialNetwork() {
        // Pre-train with synthetic data to avoid "uninitialized network" errors
        const trainingData = [
            { input: { temp: 0.4, vib: 0.1, current: 0.4 }, output: { normal: 1 } }, // Normal
            { input: { temp: 0.9, vib: 0.2, current: 0.4 }, output: { overheating: 1 } }, // High Temp
            { input: { temp: 0.4, vib: 0.9, current: 0.4 }, output: { misalignment: 1 } }, // High Vib
            { input: { temp: 0.4, vib: 0.2, current: 0.9 }, output: { overload: 1 } } // High Current
        ];
        this.net.train(trainingData);
        console.log('🧠 Neural Network: Pre-trained with synthetic baselines');
    }

    // --- EWMA Update (Eq 4) ---
    updateDrift(metric, value) {
        const state = this.driftState[metric];
        const deviation = Math.abs(value - state.mean);
        let alpha = CONFIG.ewma.alphaBase;

        if (CONFIG.ewma.alphaDynamic) {
            if (state.var > 0 && deviation > (Math.sqrt(state.var) * 3)) alpha = 0.5;
        }

        state.mean = alpha * value + (1 - alpha) * state.mean;
        const beta = 0.1;
        state.var = (1 - beta) * state.var + beta * Math.pow(deviation, 2);
        return state.mean;
    }

    // --- Health Penalty (Eq 5) ---
    calculatePenalty(value, metric) {
        const lambda = CONFIG.sensitivity[metric];
        const tau = CONFIG.thresholds[metric];
        return 1 / (1 + Math.exp(-lambda * (value - tau)));
    }

    // --- Main Prediction Pipeline ---
    predictHealth(temp, vib, current, nodeId = 'default') {

        // 1. EWMA Drift Estimation
        const dTemp = this.updateDrift('temp', temp);
        const dVib = this.updateDrift('vib', vib);
        const dCurrent = this.updateDrift('current', current);

        // 2. Anomaly Detection (Isolation Forest)
        const features = [temp, vib, current];
        this.isolationForest.train(features);
        const anomalyScore = this.isolationForest.score(features);
        const isAnomaly = anomalyScore > 0.6;

        // 3. Health Score Calculation (Eq 6)
        const pTemp = this.calculatePenalty(dTemp, 'temp');
        const pVib = this.calculatePenalty(dVib, 'vib');
        const pCurrent = this.calculatePenalty(dCurrent, 'current');

        const totalPenalty = (CONFIG.weights.temp * pTemp + CONFIG.weights.vib * pVib + CONFIG.weights.current * pCurrent);
        const healthScore = Math.max(0, Math.min(100, (1 - totalPenalty) * 100));

        // 4. Neural Network Fault Classification
        // Normalize inputs roughly 0-1 for NN (assuming max operational ranges: 100C, 5g, 20A)
        const nnInput = {
            temp: Math.min(1, temp / 100),
            vib: Math.min(1, vib / 5),
            current: Math.min(1, current / 20)
        };
        const nnOutput = this.net.run(nnInput);

        // Find dominant fault class
        let maxProb = 0;
        let faultType = 'None';
        for (const [fault, prob] of Object.entries(nnOutput)) {
            if (prob > maxProb) {
                maxProb = prob;
                faultType = fault;
            }
        }
        if (faultType === 'normal') faultType = 'None';
        // If system is healthy, force None
        if (healthScore > 80) faultType = 'None';

        // 5. Advanced RUL Estimation (Linear Regression)
        const rul = this.estimateRULRegression(nodeId, healthScore);

        this.trainingCount++;

        return {
            health: healthScore,
            anomalyScore: anomalyScore,
            isAnomaly: isAnomaly,
            rul: rul,
            fault: faultType,
            confidence: maxProb, // NN Confidence
            trainingCount: this.trainingCount,
            drift: { temp: dTemp, vib: dVib, current: dCurrent }
        };
    }

    // --- Advanced RUL (Eq 7 - Regression) ---
    estimateRULRegression(nodeId, currentHealth) {
        if (!this.nodeHistories.has(nodeId)) {
            this.nodeHistories.set(nodeId, []);
        }
        const history = this.nodeHistories.get(nodeId);

        // Add current point with timestamp/index
        // Using index for simplicity (time steps)
        history.push([history.length, currentHealth]);

        // Keep buffer size
        if (history.length > CONFIG.rul.historySize) {
            history.shift(); // Remove oldest
            // Re-index X axis to start from 0 to avoid large numbers? 
            // Better: just keep sliding window. 
            // Simple-statistics linearRegression takes [[x,y], [x,y]].
        }

        if (history.length < 10) {
            // Not enough data for trend
            return 999;
        }

        // Calculate Trend (Slope)
        const regression = ss.linearRegression(history);
        const slope = regression.m; // Change in health per step
        // const intercept = regression.b; // Current intercept (smoothed health)

        // If slope is positive or zero (health improving or stable), RUL is infinite/max
        if (slope >= -0.01) {
            return '> 1000h';
        }

        // Calculate steps to Critical Health (e.g., 20)
        // TargetY = m * x + b  =>  x = (TargetY - b) / m
        // But we want "remaining" steps from "now" (last x)
        // Current Step = history[last][0]
        // Predicted Failure Step = (Critical - regression.b) / slope

        const currentStep = history[history.length - 1][0];
        const predictedFailureStep = (CONFIG.rul.criticalHealth - regression.b) / slope;

        const remainingSteps = predictedFailureStep - currentStep;

        // Convert steps to hours (assuming 1 step = 1 second for demo -> / 3600 for hours??)
        // For demo, let's return raw "Time Units" or map 1 step = 1 hour for impact
        // Paper says "Degradation Rate", let's map simply.
        const estimatedHours = Math.max(0, Math.floor(remainingSteps));

        return estimatedHours < 1000 ? estimatedHours : '> 1000h';
    }

    train(temp, vib, current, targetHealth) {
        // Online training for NN
        // If we have a labeled fault event (e.g. from user feedback), we would train here.
        // For now, we perform auto-recalibration if data seems wildly off but stable?
        // Implementation kept minimal to match interface.
    }

    getStatus() {
        return {
            algorithm: 'Isolation Forest + Brain.js NN',
            trees: this.isolationForest.trees.length,
            rulMethod: 'Linear Regression (Simple-Statistics)',
            drift: this.driftState
        };
    }
}

export default MLModel;
