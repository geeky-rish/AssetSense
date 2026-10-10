import React from 'react';
import { Wifi, Server, Activity, Radio, Clock } from 'lucide-react';

const SystemStatus = ({ status, nodeCount }) => {
    const isConnected = status.mqtt?.includes('Connected') || status.mqtt?.includes('Edge');

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            background: 'var(--bg-panel)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap'
        }}>
            {/* MQTT Status */}
            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Radio size={16} color={isConnected ? 'var(--status-healthy)' : 'var(--status-critical)'} />
                <span style={{ fontSize: '0.85rem' }}>MQTT: {isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>

            {/* WebSocket Status */}
            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Wifi size={16} color={isConnected ? 'var(--status-healthy)' : 'var(--status-critical)'} />
                <span style={{ fontSize: '0.85rem' }}>WS: {isConnected ? 'Live' : 'Offline'}</span>
            </div>

            {/* Node Count */}
            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Server size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.85rem' }}>Nodes: {nodeCount}</span>
            </div>

            {/* Latency */}
            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Activity size={16} color={status.latency < 100 ? 'var(--status-healthy)' : 'var(--accent-warning)'} />
                <span style={{ fontSize: '0.85rem' }}>Latency: {Math.round(status.latency)}ms</span>
            </div>

            {/* ML Indicator */}
            <div className="flex-center" style={{
                gap: '0.5rem',
                background: 'rgba(139, 92, 246, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
                <Clock size={14} color="#8b5cf6" />
                <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '600' }}>ML Active</span>
            </div>
        </div>
    );
};

export default SystemStatus;

