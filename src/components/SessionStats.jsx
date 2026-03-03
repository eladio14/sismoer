import React from 'react';
import { Timer, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const SessionStats = ({ totalTime, goodTime, badTime }) => {
    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const efficiency = totalTime > 0 ? Math.round((goodTime / totalTime) * 100) : 100;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 lg:mb-8">
            {/* Total Duration */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/5 shadow-xl flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-white/10 group">
                <div className="p-2.5 sm:p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 hidden sm:block">
                    <Timer size={24} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Duración</p>
                    <p className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">{formatTime(totalTime)}</p>
                </div>
            </div>

            {/* Efficiency */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/5 shadow-xl flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-white/10 group">
                <div className={`p-2.5 sm:p-3.5 rounded-2xl border transition-transform duration-300 hidden sm:block group-hover:scale-110 ${efficiency >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    <Activity size={24} className={`drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Eficiencia</p>
                    <p className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">{efficiency}%</p>
                </div>
            </div>

            {/* Good Posture Time */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/5 shadow-xl flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-emerald-500/20 group">
                <div className="p-2.5 sm:p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 hidden sm:block group-hover:scale-110 transition-transform duration-300 relative">
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CheckCircle size={24} className="relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Ideal</p>
                    <p className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">{formatTime(goodTime)}</p>
                </div>
            </div>

            {/* Bad Posture Time */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/5 shadow-xl flex items-center gap-3 sm:gap-5 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-rose-500/20 group">
                <div className="p-2.5 sm:p-3.5 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 hidden sm:block group-hover:scale-110 transition-transform duration-300 relative">
                    <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <AlertTriangle size={24} className="relative z-10 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                </div>
                <div>
                    <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Cuidado</p>
                    <p className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">{formatTime(badTime)}</p>
                </div>
            </div>
        </div>
    );
};

export default SessionStats;
