import React from 'react';

const NodeGrid = ({ nodes }) => {
    return (
        <div className="card" style={{ overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>Multi-Node Overview</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Node</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Temp (°C)</th>
                        <th style={{ padding: '0.75rem' }}>Vib (g)</th>
                        <th style={{ padding: '0.75rem' }}>Current (A)</th>
                        <th style={{ padding: '0.75rem' }}>Health</th>
                        <th style={{ padding: '0.75rem' }}>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {nodes.map(node => (
                        <tr key={node.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.75rem', fontWeight: '500' }}>{node.name}</td>
                            <td style={{ padding: '0.75rem' }}>
                                <span
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        backgroundColor: node.status === 'healthy' ? 'rgba(34, 197, 94, 0.1)' : node.status === 'warning' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: node.status === 'healthy' ? 'var(--status-healthy)' : node.status === 'warning' ? 'var(--status-warning)' : 'var(--status-critical)'
                                    }}
                                >
                                    {node.status.toUpperCase()}
                                </span>
                            </td>
                            <td style={{ padding: '0.75rem' }}>{node.temp.toFixed(1)}</td>
                            <td style={{ padding: '0.75rem' }}>{node.vib.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem' }}>{node.current.toFixed(1)}</td>
                            <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-panel)', borderRadius: '3px', width: '60px' }}>
                                        <div style={{
                                            width: `${node.health}%`,
                                            height: '100%',
                                            background: node.health > 80 ? 'var(--status-healthy)' : node.health > 60 ? 'var(--status-warning)' : 'var(--status-critical)',
                                            borderRadius: '3px',
                                            transition: 'width 0.5s'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem' }}>{Math.round(node.health)}</span>
                                </div>
                            </td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {node.history[node.history.length - 1]?.time}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NodeGrid;
