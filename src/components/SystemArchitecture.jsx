import React from 'react';
import { Cpu, Wifi, Server, Monitor, ArrowDown, Activity, Thermometer, Zap, Database, Mail, Bell } from 'lucide-react';

const SystemArchitecture = () => {
    const layers = [
        {
            name: 'Sensing Layer',
            subtitle: 'Edge & Physical Acquisition',
            color: '#22c55e',
            icon: Cpu,
            components: [
                { name: 'ESP32 MCU', desc: 'Dual-core 240MHz, WiFi' },
                { name: 'MPU6050 IMU', desc: '6-axis accelerometer/gyroscope' },
                { name: 'DS18B20', desc: 'Temperature sensor' },
                { name: 'ACS712', desc: 'Current sensor' },
            ],
            stats: { label: 'Sampling Rate', value: '50Hz' }
        },
        {
            name: 'Network Layer',
            subtitle: 'Transport & Communication',
            color: '#3b82f6',
            icon: Wifi,
            components: [
                { name: 'MQTT Protocol', desc: 'QoS Level 1, pub/sub messaging' },
                { name: 'HiveMQ Broker', desc: 'Cloud MQTT broker' },
                { name: 'Topic Structure', desc: 'assetsense/nodes/{nodeId}' },
            ],
            stats: { label: 'Avg Latency', value: '~120ms' }
        },
        {
            name: 'Processing Layer',
            subtitle: 'Cloud Analytics (Node.js)',
            color: '#f59e0b',
            icon: Server,
            components: [
                { name: 'Drift Estimation', desc: 'EWMA Stochastic Filter (Eq. 4)' },
                { name: 'Anomaly Detection', desc: 'Isolation Forest (Day-Zero)' },
                { name: 'Health Scoring', desc: 'Sigmoid Penalty Function (Eq. 5)' },
                { name: 'Alert System', desc: 'Email notifications (QoS 1)' },
            ],
            stats: { label: 'ML Inference', value: '~10ms' }
        },
        {
            name: 'Application Layer',
            subtitle: 'UI & Visualization',
            color: '#8b5cf6',
            icon: Monitor,
            components: [
                { name: 'React Dashboard', desc: 'Real-time monitoring' },
                { name: 'WebSocket Client', desc: 'Live data streaming' },
                { name: 'Analytics', desc: 'Charts & trend analysis' },
                { name: 'Fault Simulation', desc: 'Testing & validation' },
            ],
            stats: { label: 'Update Rate', value: '1Hz' }
        },
    ];

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1400px] space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b border-gray-800 pb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Cpu className="text-blue-500" size={28} />
                    System Architecture
                </h2>
                <p className="text-gray-400 mt-2 text-base leading-relaxed max-w-3xl">
                    IoT-Enabled Predictive Maintenance System with Edge-Based Machine Learning for Industrial Motor Monitoring
                </p>
            </div>

            {/* Architecture Flow */}
            <div className="space-y-4">
                {layers.map((layer, index) => (
                    <React.Fragment key={layer.name}>
                        {/* Layer Card */}
                        <div
                            className="bg-[#0f1115] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
                            style={{ borderLeftColor: layer.color, borderLeftWidth: '4px' }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Layer Header */}
                                <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${layer.color}20` }}
                                    >
                                        <layer.icon size={24} style={{ color: layer.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
                                        <p className="text-sm text-gray-500">{layer.subtitle}</p>
                                    </div>
                                </div>

                                {/* Components Grid */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {layer.components.map((comp) => (
                                        <div
                                            key={comp.name}
                                            className="bg-[#181b21] rounded-lg p-3 border border-gray-800/50"
                                        >
                                            <p className="text-sm font-medium text-gray-200">{comp.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{comp.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Badge */}
                                <div className="lg:w-32 flex-shrink-0">
                                    <div
                                        className="text-center py-2 px-3 rounded-lg"
                                        style={{ backgroundColor: `${layer.color}10`, border: `1px solid ${layer.color}30` }}
                                    >
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{layer.stats.label}</p>
                                        <p className="text-lg font-bold" style={{ color: layer.color }}>{layer.stats.value}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Connector */}
                        {index < layers.length - 1 && (
                            <div className="flex justify-center py-1">
                                <div className="flex flex-col items-center text-gray-600">
                                    <ArrowDown size={20} />
                                    <span className="text-xs mt-1">
                                        {index === 0 ? 'MQTT Publish' : index === 1 ? 'Message Relay' : 'WebSocket'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                    { label: 'Detection Accuracy', value: '92.3%', icon: Activity, color: '#22c55e' },
                    { label: 'E2E Latency', value: '~1.2s', icon: Zap, color: '#3b82f6' },
                    { label: 'Message Delivery', value: '100%', icon: Mail, color: '#f59e0b' },
                    { label: 'Cost per Node', value: '~$20', icon: Cpu, color: '#8b5cf6' },
                ].map((metric) => (
                    <div key={metric.label} className="bg-[#0f1115] border border-gray-800 rounded-xl p-4 text-center">
                        <metric.icon size={20} className="mx-auto mb-2" style={{ color: metric.color }} />
                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Threshold Reference */}
            <div className="bg-[#0f1115] border border-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Threshold-Based Fault Detection</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <Activity size={18} className="text-blue-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-200">Vibration (RMS)</p>
                            <p className="text-xs text-gray-500">Warning: &gt;0.5g • Critical: &gt;1.0g</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Thermometer size={18} className="text-red-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-200">Temperature</p>
                            <p className="text-xs text-gray-500">Warning: &gt;75°C • Critical: &gt;85°C</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Zap size={18} className="text-yellow-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-200">Current Draw</p>
                            <p className="text-xs text-gray-500">Warning: &gt;20% deviation from nominal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemArchitecture;
