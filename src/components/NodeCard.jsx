import React from 'react';
import HealthGauge from './HealthGauge';
import RealTimeChart from './RealTimeChart';
import MachineAnimation from './MachineAnimation';
import { Activity, Thermometer, Zap, AlertTriangle, Power, Brain } from 'lucide-react';

const NodeCard = ({ node, onClick }) => {
    const isCritical = node.status === 'critical';
    const isWarning = node.status === 'warning';
    const isActive = node.isActive !== false;

    const borderColor = isCritical ? 'var(--status-critical)' : isWarning ? 'var(--status-warning)' : 'var(--border-color)';
    const pulseClass = isCritical ? 'animate-pulse-red' : isWarning ? 'animate-pulse-yellow' : '';
    const opacityClass = isActive ? 'opacity-100' : 'opacity-50 grayscale';

    // LED Color Logic
    let ledColor = 'bg-green-500';
    if (!isActive) ledColor = 'bg-gray-400';
    else if (isCritical) ledColor = 'bg-red-500';
    else if (isWarning) ledColor = 'bg-yellow-500';

    return (
        <div
            className={`card ${pulseClass} ${opacityClass} relative overflow-hidden group`}
            style={{ borderColor, cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => onClick(node)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* LED Status Indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ledColor} shadow-[0_0_8px_currentColor] animate-pulse`}></div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {isActive ? (isCritical ? 'FAULT' : 'RUN') : 'OFF'}
                </span>
            </div>

            {/* Fault Overlay */}
            {node.fault !== 'None' && (
                <div className="absolute top-10 right-0 p-2 bg-red-500/20 rounded-l-lg border-l border-y border-red-500/30 backdrop-blur-sm transform translate-x-2 group-hover:translate-x-0 transition-transform">
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse">
                        <AlertTriangle size={14} />
                        {node.fault}
                    </div>
                </div>
            )}

            {!isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
                    <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-gray-400">
                        <Power size={16} />
                        <span className="font-mono text-sm">STANDBY / OFFLINE</span>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="flex items-center gap-2">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{node.name}</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Machine Animation Section */}
                <div className="flex flex-col items-center justify-center w-24">
                    <MachineAnimation type={node.type} status={node.status} fault={node.fault} />
                    <HealthGauge value={node.health} size={60} />
                </div>

                <div style={{ flex: 1, display: 'grid', gap: '0.5rem' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <span className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Thermometer size={16} className={node.temp > 80 ? 'text-red-400 animate-pulse' : ''} /> Temp
                        </span>
                        <span style={{ fontWeight: 'bold', color: node.temp > 85 ? '#ef4444' : node.temp > 75 ? '#f59e0b' : 'inherit' }}>
                            {node.temp.toFixed(1)}°C
                            {node.temp > 75 && <span style={{ fontSize: '0.6rem', marginLeft: '4px', color: node.temp > 85 ? '#ef4444' : '#f59e0b' }}>!</span>}
                        </span>
                    </div>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <span className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Activity size={16} className={node.vib > 0.5 ? 'text-orange-400 animate-pulse' : ''} /> Vib
                        </span>
                        <span style={{ fontWeight: 'bold', color: node.vib > 1.0 ? '#ef4444' : node.vib > 0.5 ? '#f59e0b' : 'inherit' }}>
                            {node.vib.toFixed(2)}g
                            {node.vib > 0.5 && <span style={{ fontSize: '0.6rem', marginLeft: '4px', color: node.vib > 1.0 ? '#ef4444' : '#f59e0b' }}>!</span>}
                        </span>
                    </div>
                    <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                        <span className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Zap size={16} className={node.current > 12 ? 'text-yellow-400 animate-pulse' : ''} /> Load
                        </span>
                        <span style={{ fontWeight: 'bold' }}>{node.current.toFixed(1)}A</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Temperature Trend (24h)</div>
                <RealTimeChart data={node.history} dataKey="temp" color={isCritical ? '#ef4444' : 'var(--accent-primary)'} height={60} />
            </div>
        </div>
    );
};

export default NodeCard;
