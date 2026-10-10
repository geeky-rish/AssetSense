import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { BarChart2, Activity, AlertTriangle, ArrowRight, Brain, Target, Zap, Clock } from 'lucide-react';

const Analytics = ({ nodes }) => {
    const [timeRange, setTimeRange] = useState('daily');

    // Calculate real-time trend data from node history
    const trendData = useMemo(() => {
        if (!nodes || nodes.length === 0) return [];

        const historyLength = nodes[0]?.history?.length || 0;
        if (historyLength === 0) return [];

        // Create an array of aggregated data points
        const aggregatedHistory = [];

        for (let i = 0; i < historyLength; i++) {
            let totalTemp = 0;
            let totalHealth = 0;
            let validNodes = 0;

            nodes.forEach(node => {
                const historyPoint = node.history?.[i];
                if (historyPoint) {
                    totalTemp += typeof historyPoint.temp === 'number' ? historyPoint.temp : 0;
                    totalHealth += typeof historyPoint.health === 'number' ? historyPoint.health : 0;
                    validNodes++;
                }
            });

            if (validNodes > 0) {
                // Use the time from the first node as the reference time
                const timeLabel = nodes[0].history[i].time;
                aggregatedHistory.push({
                    time: timeLabel,
                    temp: Number((totalTemp / validNodes).toFixed(1)),
                    health: Number((totalHealth / validNodes).toFixed(1)),
                });
            }
        }

        return aggregatedHistory;
    }, [nodes]);

    const radarData = nodes.map(node => ({
        subject: node.name.split(' ')[0],
        Health: node.health,
        Efficiency: 100 - (node.temp - 40),
        Stability: 100 - (node.vib * 10),
        fullMark: 100,
    }));

    return (
        <div className="container mx-auto px-6 py-10 max-w-[1600px] space-y-16 animate-in fade-in duration-700">
            {/* Header Section - Modern & Clean */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="max-w-3xl">
                    <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                            Analytics Overview
                        </span>
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-light leading-relaxed">
                        Real-time system telemetry and predictive insights provided by AssetSense AI.
                    </p>
                </div>

                <div className="flex items-center p-1 bg-white/5 rounded-full backdrop-blur-md">
                    {['Daily', 'Weekly', 'Monthly'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range.toLowerCase())}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${timeRange === range.toLowerCase()
                                ? 'bg-blue-600/90 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* ML Detection Performance Metrics - Borderless Glass Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Detection Accuracy', value: '92.3%', icon: Target, color: '#22c55e', desc: 'ML Model', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]' },
                    { label: 'Precision', value: '89.7%', icon: Brain, color: '#3b82f6', desc: 'True Positive Rate', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
                    { label: 'Recall', value: '94.1%', icon: Activity, color: '#f59e0b', desc: 'Fault Detection', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
                    { label: 'F1 Score', value: '91.8%', icon: Zap, color: '#8b5cf6', desc: 'Harmonic Mean', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' },
                ].map((metric) => (
                    <div
                        key={metric.label}
                        className={`relative group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:-translate-y-1 ${metric.glow}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{metric.label}</span>
                            <div className="p-2 rounded-lg bg-white/5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <metric.icon size={20} style={{ color: metric.color }} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-bold text-white tracking-tighter">{metric.value}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">{metric.desc}</p>
                    </div>
                ))}
            </div>

            {/* Main Grid Layout - Seamless Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">

                {/* System Health Trend - Floating Canvas */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                                <Activity size={22} className="text-blue-500" />
                                System Health Trend
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">Correlated health score vs. temperature variance</p>
                        </div>
                        <div className="flex gap-8 text-sm font-medium">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                Health Index
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                Temperature
                            </div>
                        </div>
                    </div>

                    {/* Seamless Chart Container */}
                    <div className="h-[400px] w-full bg-gradient-to-b from-white/5 via-transparent to-transparent rounded-3xl p-4 backdrop-blur-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderColor: 'transparent',
                                        borderRadius: '12px',
                                        color: '#f8fafc',
                                        padding: '16px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ color: '#cbd5e1', fontSize: '13px', paddingBottom: '4px' }}
                                    cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="health"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                    fill="url(#colorHealth)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', boxShadow: '0 0 10px #22c55e' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temp"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={false}
                                    strokeDasharray="4 4" // Dotted for secondary metric
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                    opacity={0.8}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Radar */}
                <div className="relative">
                    <div className="mb-8 px-2">
                        <h3 className="text-xl font-semibold text-white">Performance Dimensions</h3>
                        <p className="text-sm text-gray-500 mt-2">Multi-axis comparative analysis across active nodes</p>
                    </div>
                    <div className="h-[400px] w-full relative flex items-center justify-center bg-gradient-to-b from-white/5 via-transparent to-transparent rounded-3xl p-4 backdrop-blur-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#334155" opacity={0.3} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13, dy: 5 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Metrics"
                                    dataKey="Health"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="#3b82f6"
                                    fillOpacity={0.2}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
                                    formatter={(value) => <span className="text-gray-400 font-medium">{value}</span>}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Maintenance Forecast - Clean List / Cards */}
            <div className="pt-8">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Maintenance Forecast</h3>
                        <p className="text-sm text-gray-500 mt-2">AI-Predicted Remaining Useful Life (RUL)</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors group px-4 py-2 rounded-lg hover:bg-blue-500/10">
                        Export Full Report <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nodes.map(node => {
                        const rulPercentage = Math.min(100, (node.rul / 2000) * 100);
                        const isCritical = node.rul < 200;

                        return (
                            <div key={node.id} className="group relative p-6 rounded-2xl bg-[#13161c] hover:bg-[#1c2029] transition-all duration-300">
                                {/* Subtle Hover Glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col justify-between h-[160px]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-200 text-lg group-hover:text-white transition-colors">{node.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{node.type}</p>
                                        </div>
                                        {isCritical ? (
                                            <div className="bg-red-500/10 p-2 rounded-lg animate-pulse">
                                                <AlertTriangle size={18} className="text-red-500" />
                                            </div>
                                        ) : (
                                            <Clock size={18} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className={`text-4xl font-bold tracking-tight ${isCritical ? 'text-red-500' : 'text-white'}`}>
                                                {Math.round(node.rul)}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium">hrs</span>
                                        </div>

                                        <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out ${isCritical ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                                    rulPercentage < 50 ? 'bg-amber-500' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
                                                    }`}
                                                style={{ width: `${rulPercentage}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wide">
                                            <span className="text-gray-600">Health Status</span>
                                            <span className={isCritical ? 'text-red-400' : 'text-green-400'}>
                                                {isCritical ? 'Action Required' : 'Optimal'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
