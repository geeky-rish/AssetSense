import React from 'react';
import { X, Thermometer, Activity, Zap, Clock, AlertTriangle, Brain, TrendingUp } from 'lucide-react';
import RealTimeChart from './RealTimeChart';
import RULPanel from './RULPanel';

const NodeDetailModal = ({ node, onClose }) => {
    if (!node) return null;

    // ML-specific values with fallbacks
    const rul = node.rul ?? Math.round(node.health * 10);
    const anomalyScore = node.anomalyScore ?? 0;
    const mlConfidence = node.mlConfidence ?? 0;
    const predictionSource = node.predictionSource ?? 'Rule-Based';
    const isAnomaly = node.isAnomaly ?? false;

    // Confidence indicator color
    const getConfidenceColor = (conf) => {
        if (conf >= 0.8) return 'var(--status-healthy)';
        if (conf >= 0.6) return 'var(--accent-warning)';
        return 'var(--status-critical)';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{node.name} Details</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            background: 'var(--bg-panel)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.9rem'
                        }}>
                            Type: {node.type.toUpperCase()}
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            background: node.health > 80 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: node.health > 80 ? 'var(--status-healthy)' : 'var(--status-critical)',
                            fontSize: '0.9rem'
                        }}>
                            Health Score: {Math.round(node.health)}
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            background: predictionSource === 'ML' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                            color: predictionSource === 'ML' ? '#a78bfa' : 'var(--text-muted)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            <Brain size={12} /> {predictionSource}
                        </span>
                        {isAnomaly && (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: 'var(--status-critical)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <AlertTriangle size={12} /> Anomaly Detected
                            </span>
                        )}
                    </div>
                </div>

                {/* ML Prediction Section */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '1.5rem',
                    padding: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Brain size={18} color="#a78bfa" />
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>ML Predictions</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>RUL (Hours)</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rul}h</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Anomaly Score</div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: anomalyScore > 0.5 ? 'var(--status-critical)' : 'var(--status-healthy)'
                            }}>
                                {(anomalyScore * 100).toFixed(0)}%
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ML Confidence</div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: getConfidenceColor(mlConfidence)
                            }}>
                                {(mlConfidence * 100).toFixed(0)}%
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fault Class</div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: node.fault === 'None' ? 'var(--status-healthy)' : 'var(--accent-warning)'
                            }}>
                                {node.fault || 'None'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
                    <div className="card" style={{ background: 'var(--bg-panel)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Thermometer size={16} /> Temperature
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{node.temp.toFixed(1)}°C</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Threshold: 90°C</div>
                    </div>
                    <div className="card" style={{ background: 'var(--bg-panel)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={16} /> Vibration RMS
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{node.vib.toFixed(2)}g</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Threshold: 3.0g</div>
                    </div>
                    <div className="card" style={{ background: 'var(--bg-panel)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={16} /> Current Load
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{node.current.toFixed(1)}A</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Threshold: 15A</div>
                    </div>
                    <div className="card" style={{ background: 'var(--bg-panel)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} /> Training Status
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{node.trainingCount ?? 0}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Samples Learned</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Temperature Trend</h3>
                        <RealTimeChart data={node.history} dataKey="temp" color="var(--accent-primary)" height={200} />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Vibration Trend</h3>
                        <RealTimeChart data={node.history} dataKey="vib" color="var(--accent-warning)" height={200} />
                    </div>
                    <RULPanel node={node} />
                </div>
            </div>
        </div>
    );
};

export default NodeDetailModal;
