import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const RULPanel = ({ node }) => {
    if (!node) return null;

    const rulDays = Math.round(node.rul / 24);
    let statusColor = 'var(--status-healthy)';
    let statusText = 'Safe';

    if (rulDays < 7) {
        statusColor = 'var(--status-critical)';
        statusText = 'Urgent Replacement';
    } else if (rulDays < 30) {
        statusColor = 'var(--status-warning)';
        statusText = 'Plan Maintenance';
    }

    return (
        <div className="card" style={{ background: 'var(--bg-panel)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>RUL Prediction</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{Math.round(node.rul)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hrs</span></div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>~{rulDays} Days Remaining</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        background: statusColor === 'var(--status-healthy)' ? 'rgba(34, 197, 94, 0.1)' : statusColor === 'var(--status-warning)' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: statusColor,
                        fontWeight: '600',
                        display: 'inline-block',
                        marginBottom: '0.25rem'
                    }}>
                        {statusText}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence: 87%</div>
                </div>
            </div>

            <div style={{ marginTop: '1rem', height: '6px', background: 'var(--bg-dark)', borderRadius: '3px' }}>
                <div style={{
                    width: `${Math.min(100, (node.rul / 2000) * 100)}%`,
                    height: '100%',
                    background: statusColor,
                    borderRadius: '3px',
                    transition: 'width 1s'
                }} />
            </div>
        </div>
    );
};

export default RULPanel;
