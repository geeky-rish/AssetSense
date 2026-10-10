import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RealTimeChart = ({ data, dataKey, color, height = 100 }) => {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false} // Disable for smoother real-time feel
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RealTimeChart;
