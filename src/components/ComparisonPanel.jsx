import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonPanel = ({ nodes }) => {
    const data = nodes.map(node => ({
        name: node.name,
        Temp: node.temp,
        Vib: node.vib * 10, // Scale up for visibility
        Current: node.current,
        Health: node.health
    }));

    return (
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Node Comparison Analysis</h3>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="var(--text-muted)" />
                        <YAxis stroke="var(--text-muted)" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Legend />
                        <Bar dataKey="Temp" fill="var(--accent-primary)" name="Temp (°C)" />
                        <Bar dataKey="Vib" fill="var(--accent-warning)" name="Vib (x10 g)" />
                        <Bar dataKey="Current" fill="var(--accent-success)" name="Current (A)" />
                        <Bar dataKey="Health" fill="var(--status-healthy)" name="Health Score" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComparisonPanel;
