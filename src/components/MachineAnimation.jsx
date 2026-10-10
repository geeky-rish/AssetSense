import React from 'react';

const MachineAnimation = ({ type, status, fault }) => {
    const isCritical = status === 'critical';
    const isWarning = status === 'warning';

    // Animation Classes
    const shakeClass = isCritical ? 'animate-shake' : '';
    const spinClass = type === 'motor' || type === 'pump' ? 'animate-spin-slow' : '';
    const pistonClass = type === 'compressor' ? 'animate-piston' : '';

    // Color Filters
    const colorFilter = isCritical
        ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))'
        : isWarning
            ? 'drop-shadow(0 0 5px rgba(234, 179, 8, 0.6))'
            : 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.4))';

    // Heat Map Overlay
    const showHeatMap = fault === 'Overheating';

    return (
        <div className={`relative w-24 h-24 flex items-center justify-center ${shakeClass}`}>
            {/* Heat Map Overlay */}
            {showHeatMap && (
                <div className="absolute inset-0 rounded-full heat-map-overlay z-10 animate-pulse" style={{
                    background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%)',
                    mixBlendMode: 'overlay'
                }}></div>
            )}

            {/* Machine Visuals (CSS Shapes) */}
            <div
                className={`transition-all duration-500 ${spinClass} ${pistonClass}`}
                style={{ filter: colorFilter }}
            >
                {type === 'pump' && (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <defs>
                            <linearGradient id="pumpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                        </defs>
                        <circle cx="12" cy="12" r="10" stroke="url(#pumpGrad)" strokeWidth="0.5" fill="rgba(30,41,59,0.5)" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(255,255,255,0.1)" />
                        <path d="M2 12a10 10 0 0 1 10-10" stroke="rgba(255,255,255,0.1)" />
                        <circle cx="12" cy="12" r="3" fill="#3b82f6" className="opacity-80" />
                        {/* Impeller Blades */}
                        <g transform="rotate(0 12 12)">
                            <path d="M12 12 L18 8" strokeLinecap="round" strokeWidth="2" />
                            <path d="M12 12 L6 16" strokeLinecap="round" strokeWidth="2" />
                            <path d="M12 12 L16 18" strokeLinecap="round" strokeWidth="2" />
                            <path d="M12 12 L8 6" strokeLinecap="round" strokeWidth="2" />
                        </g>
                    </svg>
                )}

                {type === 'motor' && (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <rect x="4" y="4" width="16" height="16" rx="2" fill="rgba(30,41,59,0.5)" stroke="#475569" />
                        <circle cx="12" cy="12" r="6" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className={isCritical ? 'animate-spin' : ''} />
                        <path d="M12 6v12" stroke="rgba(255,255,255,0.1)" />
                        <path d="M6 12h12" stroke="rgba(255,255,255,0.1)" />
                        {/* Cooling Fins */}
                        <line x1="2" y1="6" x2="4" y2="6" stroke="#64748b" />
                        <line x1="2" y1="10" x2="4" y2="10" stroke="#64748b" />
                        <line x1="2" y1="14" x2="4" y2="14" stroke="#64748b" />
                        <line x1="2" y1="18" x2="4" y2="18" stroke="#64748b" />
                    </svg>
                )}

                {type === 'compressor' && (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <path d="M4 12h16" stroke="#475569" strokeWidth="2" />
                        <rect x="6" y="6" width="12" height="12" rx="2" fill="rgba(30,41,59,0.5)" stroke="#64748b" />
                        <path d="M8 6v12" stroke="rgba(255,255,255,0.1)" />
                        <path d="M16 6v12" stroke="rgba(255,255,255,0.1)" />
                        <path d="M12 6v12" stroke="#3b82f6" strokeWidth="2" />
                        {/* Piston Head */}
                        <rect x="10" y="4" width="4" height="2" fill="#3b82f6" />
                    </svg>
                )}

                {type === 'spare' && (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="rgba(30,41,59,0.5)" stroke="#475569" strokeDasharray="4 4" />
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="#64748b" />
                        <circle cx="12" cy="12" r="8" stroke="#64748b" strokeWidth="0.5" />
                    </svg>
                )}
            </div>

            {/* Status Particles (CSS) */}
            {isCritical && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full animate-ping rounded-full bg-red-500/20"></div>
                </div>
            )}
        </div>
    );
};

export default MachineAnimation;
