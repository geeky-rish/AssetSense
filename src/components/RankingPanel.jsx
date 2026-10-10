import React from 'react';

const RankingPanel = ({ nodes }) => {
    const sortedNodes = [...nodes].sort((a, b) => b.health - a.health);

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Machine Health Ranking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sortedNodes.map((node, index) => (
                    <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--bg-panel)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)'
                        }}>
                            {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.9rem' }}>{node.name}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: node.health > 80 ? 'var(--status-healthy)' : node.health > 60 ? 'var(--status-warning)' : 'var(--status-critical)' }}>
                                    {Math.round(node.health)}%
                                </span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-panel)', borderRadius: '2px' }}>
                                <div style={{
                                    width: `${node.health}%`,
                                    height: '100%',
                                    background: node.health > 80 ? 'var(--status-healthy)' : node.health > 60 ? 'var(--status-warning)' : 'var(--status-critical)',
                                    borderRadius: '2px',
                                    transition: 'width 0.5s'
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingPanel;
