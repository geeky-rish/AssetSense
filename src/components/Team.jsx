import React, { useState } from 'react';
import { Users, UserPlus, Clock, Shield, Search, MoreHorizontal } from 'lucide-react';

const Team = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const teamMembers = [
        { id: 1, name: 'Alex Chen', role: 'Lead Engineer', status: 'Active', shift: 'Morning', avatar: 'AC', color: 'bg-blue-600' },
        { id: 2, name: 'Sarah Miller', role: 'Maintenance Tech', status: 'On Shift', shift: 'Morning', avatar: 'SM', color: 'bg-purple-600' },
        { id: 3, name: 'Mike Ross', role: 'Operator', status: 'Offline', shift: 'Night', avatar: 'MR', color: 'bg-orange-600' },
    ];

    const activityLog = [
        { id: 1, user: 'Alex Chen', action: 'Injected Fault: Overheating on Pump 01', time: '10:45 AM', type: 'warning' },
        { id: 2, user: 'System', action: 'Auto-Protect Triggered: Pump 01 -> Spare', time: '10:48 AM', type: 'critical' },
        { id: 3, user: 'Sarah Miller', action: 'Repaired Pump 01', time: '11:15 AM', type: 'success' },
        // Added more mock data to fill the list visually
        { id: 4, user: 'Mike Ross', action: 'Logged out for break', time: '12:00 PM', type: 'info' },
        { id: 5, user: 'System', action: 'Routine Health Check Passed', time: '12:30 PM', type: 'success' },
    ];

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1600px] animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800 pb-8 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Users className="text-indigo-500" size={28} />
                        Team Management
                    </h2>
                    <p className="text-gray-400 mt-2 text-base max-w-xl leading-relaxed">
                        Manage personnel access, view active shifts, and audit operational logs for compliance and security.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-[#181b21] p-1.5 rounded-xl border border-gray-800">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find member..."
                            className="bg-transparent border-none text-sm text-gray-200 focus:ring-0 focus:outline-none w-48 md:w-64 pl-10 h-10 placeholder:text-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-px h-6 bg-gray-700 mx-1"></div>
                    <button className="px-5 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-sm">
                        <UserPlus size={18} />
                        <span>Add Member</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left Column: Personnel List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-white tracking-wide">Active Personnel</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-900 border border-gray-800 px-2 py-1 rounded-md">{teamMembers.length} ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {teamMembers.map(member => (
                            <div key={member.id} className="group bg-[#0f1115] border border-gray-800 hover:border-gray-600 p-5 rounded-xl flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-base shadow-md ring-4 ring-[#0f1115] group-hover:ring-gray-800 transition-all`}>
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${member.status === 'Offline'
                                                    ? 'bg-gray-900 text-gray-500 border-gray-700'
                                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-0.5">{member.role}</p>
                                    </div>
                                </div>

                                <div className="hidden xl:flex items-center gap-10 mr-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Shift</p>
                                        <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium">
                                            <Clock size={14} className="text-gray-500" /> {member.shift}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Access</p>
                                        <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium">
                                            <Shield size={14} className="text-gray-500" /> Tier {member.id}
                                        </div>
                                    </div>
                                </div>

                                <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        ))}

                        {/* Minimalist Add Button */}
                        <button className="w-full border border-dashed border-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-sm font-medium h-[80px] group">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <UserPlus size={16} />
                            </div>
                            <span>Register New Staff Member</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Audit Log - Visually Distinct */}
                <div className="relative pl-0 lg:pl-12 lg:border-l lg:border-gray-800 h-full">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-lg font-bold text-white tracking-wide">Audit Log</h3>
                        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">Full History</button>
                    </div>

                    <div className="space-y-0 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-px before:bg-gray-800">
                        {activityLog.map((log, index) => (
                            <div key={log.id} className="relative pl-12 py-5 border-b border-gray-800/50 last:border-0 hover:bg-white/[0.02] -ml-4 pl-16 pr-4 rounded-xl transition-colors group">
                                {/* Timeline Dot */}
                                <div className={`absolute left-[3px] top-7 w-2.5 h-2.5 rounded-full z-10 ring-4 ring-[#0f1115] group-hover:ring-gray-800 transition-all 
                                    ${log.type === 'critical' ? 'bg-red-500' :
                                        log.type === 'success' ? 'bg-green-500' :
                                            'bg-indigo-500'}`}>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-medium text-gray-200">{log.action}</span>
                                        <span className="text-xs font-mono text-gray-500 whitespace-nowrap ml-4">{log.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                            {log.user.charAt(0)}
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {log.user}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
