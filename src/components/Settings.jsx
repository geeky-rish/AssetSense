import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Bell, Monitor, Save, Shield, Volume2, Moon, RefreshCw, Check, Globe, Lock, Cpu } from 'lucide-react';

const Settings = () => {
    const [units, setUnits] = useState('metric');
    const [retention, setRetention] = useState('7');
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(false);

    // Threshold States
    const [tempThreshold, setTempThreshold] = useState(90);
    const [vibThreshold, setVibThreshold] = useState(2.5);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1200px] animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800 pb-8 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <SettingsIcon className="text-green-500" size={28} />
                        System Configuration
                    </h2>
                    <p className="text-gray-400 mt-2 text-base max-w-xl leading-relaxed">
                        Global system parameters, alert thresholds, and data retention policies.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">

                {/* Section 1: General Preferences */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                        <Monitor size={16} /> Interface & Data
                    </h3>

                    <div className="bg-[#0f1115] border border-gray-800 rounded-xl divide-y divide-gray-800 shadow-sm">

                        {/* Unit System */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg h-fit text-gray-400 border border-gray-800">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Measurement Units</p>
                                    <p className="text-sm text-gray-400 mt-1 max-w-sm leading-relaxed">Select standard units for sensor data display (e.g., Celsius vs Fahrenheit).</p>
                                </div>
                            </div>
                            <div className="flex bg-[#181b21] border border-gray-800 p-1.5 rounded-lg w-fit">
                                {['metric', 'imperial'].map((u) => (
                                    <button
                                        key={u}
                                        onClick={() => setUnits(u)}
                                        className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${units === u
                                                ? 'bg-gray-800 text-white shadow-sm border border-gray-700'
                                                : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Data Retention */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg h-fit text-gray-400 border border-gray-800">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Data Retention Policy</p>
                                    <p className="text-sm text-gray-400 mt-1 max-w-sm leading-relaxed">Automatic purging logic for historical sensor logs to manage storage.</p>
                                </div>
                            </div>
                            <select
                                value={retention}
                                onChange={(e) => setRetention(e.target.value)}
                                className="bg-[#181b21] border border-gray-800 text-white text-sm font-medium rounded-lg focus:ring-green-500 focus:border-green-500 block px-4 py-2.5 min-w-[180px] cursor-pointer"
                            >
                                <option value="1">24 Hours (Rolling)</option>
                                <option value="7">7 Days (Standard)</option>
                                <option value="30">30 Days (Compliance)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Section 2: Automation & Alerts */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                        <Cpu size={16} /> Automation & Safety
                    </h3>

                    <div className="bg-[#0f1115] border border-gray-800 rounded-xl divide-y divide-gray-800 shadow-sm">

                        {/* Temp Threshold */}
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4">
                                    <div className="p-2 bg-red-500/10 rounded-lg h-fit text-red-500 border border-red-500/20">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Temperature Critical Limit</p>
                                        <p className="text-sm text-gray-400 mt-1">Threshold for triggering high-temperature alerts.</p>
                                    </div>
                                </div>
                                <span className="text-red-400 text-lg font-mono font-bold bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">{tempThreshold}°C</span>
                            </div>
                            <div className="relative pt-2">
                                <input
                                    type="range"
                                    min="60"
                                    max="150"
                                    value={tempThreshold}
                                    onChange={(e) => setTempThreshold(e.target.value)}
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-colors"
                                />
                                <div className="flex justify-between text-xs font-mono text-gray-600 mt-2">
                                    <span>60°C</span>
                                    <span>MAX 150°C</span>
                                </div>
                            </div>
                        </div>

                        {/* Vib Threshold */}
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg h-fit text-yellow-500 border border-yellow-500/20">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Vibration Warning Limit</p>
                                        <p className="text-sm text-gray-400 mt-1">Threshold for triggering vibration instability warnings.</p>
                                    </div>
                                </div>
                                <span className="text-yellow-400 text-lg font-mono font-bold bg-yellow-500/10 px-3 py-1 rounded-md border border-yellow-500/20">{vibThreshold}g</span>
                            </div>
                            <div className="relative pt-2">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="10.0"
                                    step="0.1"
                                    value={vibThreshold}
                                    onChange={(e) => setVibThreshold(e.target.value)}
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-colors"
                                />
                                <div className="flex justify-between text-xs font-mono text-gray-600 mt-2">
                                    <span>0.5g</span>
                                    <span>MAX 10.0g</span>
                                </div>
                            </div>
                        </div>

                        {/* Safety Interlock */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors">
                            <div className="flex gap-4">
                                <div className="p-2 bg-green-500/10 rounded-lg h-fit text-green-500 border border-green-500/20">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">Auto-Protect Interlock</p>
                                    <p className="text-sm text-gray-400 mt-1 max-w-md leading-relaxed">Automatically shut down nodes when critical health thresholds are breached to prevent catastrophic failure.</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked readOnly />
                                <div className="w-14 h-7 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Save Actions - Fixed Bottom Right or just aligned right at bottom */}
                <div className="flex justify-end pt-4 pb-12">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-8 py-3 rounded-xl flex items-center gap-3 text-base font-semibold shadow-lg transition-all duration-300 transform active:scale-95 ${isSaving
                                ? 'bg-green-600/90 text-white cursor-wait pr-6'
                                : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-green-500/25'
                            }`}
                    >
                        {isSaving ? (
                            <><RefreshCw size={20} className="animate-spin" /> Saving Configuration...</>
                        ) : (
                            <><Check size={20} /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
