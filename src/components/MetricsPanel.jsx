import React from 'react';
import { Activity, User, FileText } from 'lucide-react';

const MetricsPanel = ({ angles, risk }) => {
    const symmetry = angles.shoulder_l - angles.shoulder_r;
    // Scale -20..20 to 0..100 for the slider
    const symmetryPos = Math.min(100, Math.max(0, 50 + (symmetry * 2.5)));

    return (
        <aside className="w-full h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar print:hidden">
            {/* Risk Card */}
            <div className={`relative p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-700 group hover:bg-slate-900/60 hover:border-white/10`}>
                {/* Glow effects */}
                <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${risk.statusColor || 'bg-slate-500'} opacity-20 blur-[50px] group-hover:opacity-40 transition-opacity duration-700`}></div>
                <div className={`absolute -left-12 -bottom-12 w-48 h-48 rounded-full ${risk.statusColor || 'bg-slate-500'} opacity-10 blur-[50px] group-hover:opacity-30 transition-opacity duration-700`}></div>

                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Nivel de Riesgo REBA</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-7xl font-black tracking-tighter ${risk.color || 'text-slate-400'} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-colors duration-500`}>{risk.score || 0}</span>
                        <span className="text-xl text-slate-500 font-light">/ 15</span>
                    </div>
                    <div className="mt-4 flex flex-col items-start gap-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 backdrop-blur-md bg-white/5 shadow-inner`}>
                            <div className={`w-2 h-2 rounded-full ${risk.statusColor || 'bg-slate-500'} shadow-[0_0_8px_currentColor]`}></div>
                            <span className={risk.color || 'text-slate-400'}>{risk.level?.toUpperCase() || 'CALCULANDO'}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 ml-2">{risk.action}</span>
                    </div>
                </div>
            </div>

            {/* Bilateral Posture */}
            <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <User size={18} className="text-blue-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Hombros</h3>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="flex justify-between text-sm font-medium text-slate-400">
                        <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-white/5">Izq: <span className="text-white">{Math.round(angles.shoulder_l || 0)}°</span></span>
                        <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-white/5">Der: <span className="text-white">{Math.round(angles.shoulder_r || 0)}°</span></span>
                    </div>

                    {/* Visual Level indicator */}
                    <div className="relative h-3 bg-slate-800/80 rounded-full w-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-500/50 transform -translate-x-1/2 z-10"></div>
                        <div
                            className={`absolute top-0 bottom-0 w-8 -mt-0 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-500 ease-out transform -translate-x-1/2 ${Math.abs(symmetry) > 10 ? 'bg-rose-500 text-rose-500' : 'bg-blue-400 text-blue-400'}`}
                            style={{ left: `${symmetryPos}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-center">
                        <p className={`text-xs font-medium px-3 py-1 rounded-full ${Math.abs(symmetry) < 5 ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {Math.abs(symmetry) < 5 ? 'Perfectamente Alineado' : symmetry > 0 ? 'Hombro Izq. Elevado ⚠️' : 'Hombro Der. Elevado ⚠️'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Axial Segments (Grupo A) */}
            <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-white/10 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <Activity size={18} className="text-purple-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Eje Central (A)</h3>
                    </div>
                    {/* Score A Badge */}
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Puntaje A:</span>
                            <span className="text-sm font-black text-purple-400">{risk.subScores.scoreA}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Neck */}
                    <div className="space-y-3 group">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-slate-300">Inclinación Cervical</span>
                            <div className="flex items-center gap-3">
                                {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Pts: {risk.subScores.neck}</span>}
                                <span className={`text-base font-black ${angles.neck > 20 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-purple-400'}`}>{Math.round(angles.neck || 0)}°</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${angles.neck > 20 ? 'bg-rose-500 text-rose-500' : 'bg-purple-500 text-purple-500'}`}
                                style={{ width: `${Math.min(100, (angles.neck / 45) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Trunk */}
                    <div className="space-y-3 group">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-slate-300">Flexión de Tronco</span>
                            <div className="flex items-center gap-3">
                                {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Pts: {risk.subScores.trunk}</span>}
                                <span className={`text-base font-black ${angles.trunk > 20 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-amber-400'}`}>{Math.round(angles.trunk || 0)}°</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${angles.trunk > 20 ? 'bg-rose-500 text-rose-500' : 'bg-amber-400 text-amber-400'}`}
                                style={{ width: `${Math.min(100, (angles.trunk / 90) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upper Extremities */}
            <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-white/10 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <Activity size={18} className="text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">M. Superiores (B)</h3>
                    </div>
                    {/* Score B Badge */}
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Puntaje B:</span>
                            <span className="text-sm font-black text-indigo-400">{risk.subScores.scoreB}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Hombros (Brazos REBA) */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-300">Brazos (Elevación)</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Pts: {risk.subScores.upperArm}</span>}
                        </div>
                    </div>

                    {/* Codos / Antebrazos */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-300">Antebrazos (Ángulo)</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Pts: {risk.subScores.lowerArm}</span>}
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Izq: <span className="text-white block">{Math.round(angles.elbow_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Der: <span className="text-white block">{Math.round(angles.elbow_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Muñecas */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-300">Muñecas</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Pts: {risk.subScores.wrist}</span>}
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Izq: <span className="text-white block">{Math.round(angles.wrist_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Der: <span className="text-white block">{Math.round(angles.wrist_r || 0)}°</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lower Extremities */}
            <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-white/10 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20">
                            <Activity size={18} className="text-teal-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Miembros Inferiores</h3>
                    </div>
                    {/* Legs Score Badge */}
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Pts Piernas:</span>
                            <span className="text-sm font-black text-teal-400">{risk.subScores.legs}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Piernas / Cadera */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-300">Piernas / Cadera</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Izq: <span className="text-white block">{Math.round(angles.hip_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Der: <span className="text-white block">{Math.round(angles.hip_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Rodillas */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-300">Rodillas</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Izq: <span className="text-white block">{Math.round(angles.knee_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Der: <span className="text-white block">{Math.round(angles.knee_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Tobillos */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-300">Tobillos</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Izq: <span className="text-white block">{Math.round(angles.ankle_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5 text-center">Der: <span className="text-white block">{Math.round(angles.ankle_r || 0)}°</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print button */}
            <button
                onClick={() => window.print()}
                className="mt-2 mb-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-[0.98] print:hidden"
            >
                <FileText size={20} />
                Imprimir reporte PDF
            </button>
        </aside>
    );
};

export default MetricsPanel;
