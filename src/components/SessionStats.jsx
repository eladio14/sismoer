import React from 'react';
import { Timer, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const SessionStats = ({ totalTime, goodTime, badTime }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const efficiency = totalTime > 0 ? Math.round((goodTime / totalTime) * 100) : 100;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 lg:mb-8">
            {/* Total Duration */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="p-2.5 sm:p-3.5 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100 group-hover:scale-110 transition-transform duration-300 hidden sm:block">
                    <Timer size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Duración</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-800 font-mono tracking-tight">{formatTime(totalTime)}</p>
                </div>
            </div>

            {/* Efficiency */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-transform duration-300 hidden sm:block group-hover:scale-110 ${efficiency >= 80 ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Eficiencia</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-800 font-mono tracking-tight">{efficiency}%</p>
                </div>
            </div>

            {/* Good Posture Time */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-emerald-200 group">
                <div className="p-2.5 sm:p-3.5 bg-emerald-50 text-emerald-500 rounded-2xl border border-emerald-100 hidden sm:block group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Ideal</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-800 font-mono tracking-tight">{formatTime(goodTime)}</p>
                </div>
            </div>

            {/* Bad Posture Time */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-rose-200 group">
                <div className="p-2.5 sm:p-3.5 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 hidden sm:block group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Cuidado</p>
                    <p className="text-lg sm:text-2xl font-black text-slate-800 font-mono tracking-tight">{formatTime(badTime)}</p>
                </div>
            </div>
        </div>
    );
};

export default SessionStats;
