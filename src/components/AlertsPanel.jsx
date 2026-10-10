import React from 'react';
import { AlertTriangle, Bell } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Active Alerts</h3>
                <div style={{ position: 'relative' }}>
                    <Bell size={20} color="var(--text-secondary)" />
                    {alerts.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            width: '10px',
                            height: '10px',
                            background: 'var(--accent-danger)',
                            borderRadius: '50%',
                            border: '2px solid var(--bg-card)'
                        }} />
                    )}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {alerts.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        No active alerts
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} style={{
                            padding: '0.75rem',
                            background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' :
                                alert.severity === 'success' ? 'rgba(34, 197, 94, 0.1)' :
                                    alert.severity === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--status-critical)' :
                                alert.severity === 'success' ? 'var(--status-healthy)' :
                                    alert.severity === 'info' ? 'var(--accent-primary)' : 'var(--status-warning)'}`,
                            borderRadius: '4px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <AlertTriangle size={16} color={
                                    alert.severity === 'critical' ? 'var(--status-critical)' :
                                        alert.severity === 'success' ? 'var(--status-healthy)' :
                                            alert.severity === 'info' ? 'var(--accent-primary)' : 'var(--status-warning)'
                                } />
                                <span style={{
                                    fontWeight: '600', fontSize: '0.9rem', color:
                                        alert.severity === 'critical' ? 'var(--status-critical)' :
                                            alert.severity === 'success' ? 'var(--status-healthy)' :
                                                alert.severity === 'info' ? 'var(--accent-primary)' : 'var(--status-warning)'
                                }}>{alert.source}</span>
                                {alert.emailSent && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.7rem',
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '12px'
                                    }}>
                                        <Bell size={12} /> Email Sent
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>{alert.message}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{alert.time}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
