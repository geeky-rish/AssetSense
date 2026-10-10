import React from 'react';
import { ShieldAlert, AlertOctagon } from 'lucide-react';

const SystemResponseBanner = ({ systemStatus, alerts }) => {
    const criticalAlert = alerts.find(a => a.severity === 'critical');
    const isAutoProtect = systemStatus.autoProtect;

    if (!criticalAlert && !isAutoProtect) return null;

    return (
        <div className="w-full mb-6 animate-in slide-in-from-top duration-500">
            {isAutoProtect ? (
                <div className="bg-gradient-to-r from-orange-900/80 to-red-900/80 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-500/20 p-2 rounded-full animate-pulse">
                            <ShieldAlert className="text-orange-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">AUTO-PROTECT TRIGGERED</h2>
                            <p className="text-orange-200">System has automatically switched load to Backup Node. Maintenance required.</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-black/30 rounded border border-white/10 text-sm text-gray-300 font-mono">
                        CODE: AP-FAILOVER-01
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-red-900/80 to-black/80 border-l-4 border-red-500 p-4 rounded-r-lg shadow-lg flex items-center gap-4">
                    <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                        <AlertOctagon className="text-red-500" size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">CRITICAL SYSTEM WARNING</h2>
                        <p className="text-red-200">{criticalAlert?.message || "Anomaly Detected"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemResponseBanner;
