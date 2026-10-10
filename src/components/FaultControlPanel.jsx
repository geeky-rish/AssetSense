import React, { useState } from 'react';
import {
    AlertTriangle, Wrench, RotateCcw, Activity, Zap, Thermometer, Settings,
    Disc, Fan, Wind, Box
} from 'lucide-react';

const FaultControlPanel = ({ nodes, injectFault, repairNode }) => {
    const [selectedNode, setSelectedNode] = useState(nodes[0]?.id || 1);
    const [selectedFault, setSelectedFault] = useState('Vibration Spike');

    const handleInject = () => {
        injectFault(Number(selectedNode), selectedFault);
    };

    const handleRepair = () => {
        repairNode(Number(selectedNode));
    };

    const activeFaultNode = nodes.find(n => n.fault !== 'None');
    const targetNode = nodes.find(n => n.id === Number(selectedNode));

    const faultTypes = [
        { id: 'Vibration Spike', icon: <Activity size={24} />, color: '#3b82f6', label: 'Vibration Spike', desc: '>1.0g RMS' },
        { id: 'Temperature Surge', icon: <Thermometer size={24} />, color: '#ef4444', label: 'Temp Surge', desc: '>85°C' },
        { id: 'Overload', icon: <Zap size={24} />, color: '#a855f7', label: 'Overload', desc: '>120% current' },
        { id: 'Bearing Wear', icon: <Disc size={24} />, color: '#eab308', label: 'Bearing Wear', desc: 'Progressive' },
        { id: 'Misalignment', icon: <Settings size={24} />, color: '#f97316', label: 'Misalignment', desc: 'Shaft vibration' },
    ];

    const getMachineIcon = (type) => {
        switch (type) {
            case 'pump': return <Fan size={20} />;
            case 'motor': return <Settings size={20} />;
            case 'compressor': return <Wind size={20} />;
            default: return <Box size={20} />;
        }
    };

    return (
        <div style={{
            background: '#111418',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            border: '1px solid #334155',
            color: '#e2e8f0'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={24} color="#3b82f6" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>FAULT INJECTION CONSOLE</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                    SYSTEM ONLINE
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* SECTION 1: Target Node Selection */}
                <div>
                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Box size={16} /> Target Machine
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {nodes.filter(n => !n.isSpare).map(node => {
                            const isSelected = Number(selectedNode) === node.id;
                            return (
                                <button
                                    key={node.id}
                                    onClick={() => setSelectedNode(node.id)}
                                    style={{
                                        flex: '1 1 120px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        background: isSelected ? 'rgba(34, 197, 94, 0.1)' : '#1e293b',
                                        border: isSelected ? '1px solid #22c55e' : '1px solid #334155',
                                        borderRadius: '8px',
                                        color: isSelected ? '#22c55e' : '#94a3b8',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isSelected ? '0 0 15px rgba(34, 197, 94, 0.2)' : 'none'
                                    }}
                                >
                                    {getMachineIcon(node.type)}
                                    <span style={{ fontWeight: '600' }}>{node.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Status Line & Risk Bar */}
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: '#94a3b8' }}>Current Status:</span>
                            <span style={{
                                fontWeight: 'bold',
                                color: targetNode?.status === 'critical' ? '#ef4444' : targetNode?.status === 'warning' ? '#eab308' : '#22c55e'
                            }}>
                                {targetNode?.status.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${100 - (targetNode?.health || 0)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #22c55e, #eab308, #ef4444)',
                                transition: 'width 0.5s ease'
                            }}></div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>RISK LEVEL</div>
                    </div>
                </div>

                {/* SECTION 2: Fault Type Selection */}
                <div>
                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} /> Fault Type
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                        {faultTypes.map(fault => {
                            const isSelected = selectedFault === fault.id;
                            return (
                                <button
                                    key={fault.id}
                                    onClick={() => setSelectedFault(fault.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1rem 0.5rem',
                                        background: isSelected ? `rgba(${parseInt(fault.color.slice(1, 3), 16)}, ${parseInt(fault.color.slice(3, 5), 16)}, ${parseInt(fault.color.slice(5, 7), 16)}, 0.1)` : '#1e293b',
                                        border: isSelected ? `1px solid ${fault.color}` : '1px solid #334155',
                                        borderRadius: '8px',
                                        color: isSelected ? fault.color : '#94a3b8',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: isSelected ? `0 0 15px ${fault.color}40` : 'none'
                                    }}
                                >
                                    <div style={{ marginBottom: '0.25rem' }}>{fault.icon}</div>
                                    <span style={{ fontWeight: '600', fontSize: '0.75rem' }}>{fault.label}</span>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>{fault.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* SECTION 3: Actions */}
                <div>
                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={16} /> Controls
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={handleInject}
                            style={{
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Zap size={20} fill="currentColor" /> INJECT FAULT
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={handleRepair}
                                disabled={!activeFaultNode}
                                style={{
                                    padding: '1rem',
                                    background: activeFaultNode ? 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)' : '#334155',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: activeFaultNode ? 'white' : '#94a3b8',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: activeFaultNode ? 'pointer' : 'not-allowed',
                                    opacity: activeFaultNode ? 1 : 0.6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Wrench size={18} /> Repair & Reset
                            </button>

                            <button
                                disabled
                                style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: 'not-allowed', // Placeholder functionality
                                    opacity: 0.6
                                }}
                            >
                                <RotateCcw size={18} /> Replay Sequence
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FaultControlPanel;
