import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const NODES_CONFIG = [
    { id: 'pump-01', name: 'Pump 01', type: 'pump' },
    { id: 'motor-01', name: 'Induction Motor', type: 'motor' },
    { id: 'compressor-01', name: 'Compressor A', type: 'compressor' },
    { id: 'spare-01', name: 'Spare Node', type: 'spare' },
];

const INITIAL_HISTORY_LENGTH = 20;

const generateInitialHistory = () => {
    return Array.from({ length: INITIAL_HISTORY_LENGTH }, (_, i) => ({
        time: new Date(Date.now() - (INITIAL_HISTORY_LENGTH - i) * 1000).toLocaleTimeString(),
        temp: 0,
        vib: 0,
        current: 0,
        health: 100,
    }));
};

function initializeDefaultNodes() {
    return NODES_CONFIG.map(node => ({
        ...node,
        temp: 0,
        vib: 0,
        current: 0,
        health: 100,
        status: 'healthy',
        fault: 'None',
        rul: 1000,
        history: generateInitialHistory(),
        isSpare: node.type === 'spare',
        isActive: node.type !== 'spare',
    }));
}

export const useSimulation = () => {
    // Initialize nodes with state validation to prevents stale localStorage issues
    const [nodes, setNodes] = useState(() => {
        try {
            const saved = localStorage.getItem('assetsense_nodes');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate that at least one node ID matches the current config format
                // logic: if saved data uses numeric IDs (old version), discard it.
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'number') {
                    console.warn('Simulation: Detected stale LocalStorage data (numeric IDs). Resetting state.');
                    localStorage.removeItem('assetsense_nodes');
                    return initializeDefaultNodes();
                }
                return parsed;
            }
        } catch (e) {
            console.error('Simulation: Error loading state', e);
        }
        return initializeDefaultNodes();
    });

    const [alerts, setAlerts] = useState([]);
    const [systemStatus, setSystemStatus] = useState({
        mqtt: 'Connecting...',
        latency: 0,
        packetLoss: 0,
        autoProtect: false,
    });

    const socketRef = useRef(null);

    const addAlert = useCallback((source, message, severity = 'warning', emailSent = false) => {
        const newAlert = {
            id: Date.now(),
            source,
            message,
            time: new Date().toLocaleTimeString(),
            severity,
            emailSent
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }, []);

    const handleSensorUpdate = useCallback((data) => {
        setNodes(prevNodes => {
            // Robust matching: Try ID match, then Name match
            const nodeIndex = prevNodes.findIndex(n =>
                String(n.id) === String(data.nodeId) ||
                n.name.toLowerCase() === String(data.nodeId).toLowerCase()
            );

            if (nodeIndex === -1) {
                console.warn(`Received update for unknown node: ${data.nodeId}`);
                return prevNodes;
            }

            const updatedNodes = [...prevNodes];
            const oldNode = updatedNodes[nodeIndex];

            // Update History
            const newHistory = [
                ...oldNode.history.slice(1),
                {
                    time: new Date().toLocaleTimeString(),
                    temp: data.temp,
                    vib: data.vib,
                    current: data.current,
                    health: data.health,
                }
            ];

            // RUL Decay
            let rulDecay = 0.01;
            if (data.health < 90) rulDecay = 0.1;
            if (data.health < 60) rulDecay = 1.0;
            const newRul = Math.max(0, oldNode.rul - rulDecay);

            // Update Node
            updatedNodes[nodeIndex] = {
                ...oldNode,
                temp: data.temp,
                vib: data.vib,
                current: data.current,
                health: data.health,
                status: data.status,
                fault: data.fault || 'None',
                rul: newRul,
                history: newHistory,
            };

            // Alert Logic for UI
            if (data.status === 'critical' && oldNode.status !== 'critical') {
                addAlert(oldNode.name, `CRITICAL: Health ${data.health.toFixed(1)}%`, 'critical');
            }

            return updatedNodes;
        });

        // Simulate network stats
        setSystemStatus(prev => ({
            ...prev,
            latency: Math.floor(Math.random() * 50) + 20,
        }));
    }, [addAlert]);

    useEffect(() => {
        // --- WebSocket Connection ---
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket Server');
            setSystemStatus(prev => ({ ...prev, mqtt: 'Connected to Edge' }));
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setSystemStatus(prev => ({ ...prev, mqtt: 'Disconnected' }));
        });

        socketRef.current.on('sensor_update', (data) => {
            console.log('Frontend received sensor_update:', data); // Debug Log
            handleSensorUpdate(data);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [handleSensorUpdate]);

    const injectFault = useCallback((nodeId, type) => {
        addAlert('SYSTEM', `Manual Fault Injection: ${type} on Node ${nodeId} (Physical Override Required)`, 'warning');
    }, [addAlert]);

    const repairNode = useCallback((nodeId) => {
        setNodes(prev => prev.map(n => {
            if (n.id === nodeId) {
                return { ...n, fault: 'None', status: 'healthy', health: 100 };
            }
            return n;
        }));
        addAlert('MAINTENANCE', `Node ${nodeId} Maintenance Logged`, 'success');
    }, [addAlert]);

    useEffect(() => {
        localStorage.setItem('assetsense_nodes', JSON.stringify(nodes));
    }, [nodes]);

    return { nodes, alerts, systemStatus, injectFault, repairNode };
};
