import React from 'react';

const HealthGauge = ({ value, size = 120 }) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    let color = 'var(--status-healthy)';
    if (value < 60) color = 'var(--status-critical)';
    else if (value < 80) color = 'var(--status-warning)';

    return (
        <div className="flex-center" style={{ width: size, height: size, position: 'relative' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--bg-panel)"
                    strokeWidth={size * 0.08}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={size * 0.08}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: `${size * 0.25}px`, fontWeight: 'bold', color }}>
                    {Math.round(value)}
                </div>
                <div style={{ fontSize: `${size * 0.12}px`, color: 'var(--text-muted)' }}>MHI</div>
            </div>
        </div>
    );
};

export default HealthGauge;
