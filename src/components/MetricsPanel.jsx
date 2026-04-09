import React from 'react';
import { Activity, User, FileText } from 'lucide-react';

const MetricsPanel = ({ angles, risk, riskHistory = [], segmentStatus = {}, onPrint }) => {
    const symmetry = (angles.shoulder_height_l || 0) - (angles.shoulder_height_r || 0);
    const neckDisplay = risk?.subScores?.adjustedNeck ?? angles.neck;
    const trunkDisplay = risk?.subScores?.adjustedTrunk ?? angles.trunk;
    // Scale -20..20 to 0..100 for the slider
    const symmetryPos = Math.min(100, Math.max(0, 50 + (symmetry * 2.5)));

    const trendData = riskHistory.slice(-18);

    const normalizeStatus = (item) => item?.status || 'ok';
    const statusStyles = {
        ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warn: 'bg-amber-50 text-amber-700 border-amber-200',
        risk: 'bg-rose-50 text-rose-700 border-rose-200'
    };

    const segments = [
        { label: 'Cervical', key: 'cervical', unit: '°' },
        { label: 'Tronco', key: 'tronco', unit: '°' },
        { label: 'Hombros', key: 'hombros', unit: '' },
        { label: 'Codos', key: 'codos', unit: '°' },
        { label: 'Muñecas', key: 'munecas', unit: '°' }
    ];

    return (
        <aside className="w-full h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar print:hidden">
            {/* Risk Card */}
            <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-500 group hover:shadow-md hover:-translate-y-0.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Nivel de Riesgo REBA</h3>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-6xl sm:text-7xl font-black tracking-tighter transition-colors duration-500 ${
                        (risk.score || 0) <= 3 ? 'text-emerald-500' :
                        (risk.score || 0) <= 7 ? 'text-amber-500' : 'text-rose-500'
                    }`}>{risk.score || 0}</span>
                    <span className="text-lg sm:text-xl text-slate-400 font-light">/ 15</span>
                </div>
                <div className="mt-4 flex flex-col items-start gap-2">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                        (risk.score || 0) <= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        (risk.score || 0) <= 7 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${
                            (risk.score || 0) <= 3 ? 'bg-emerald-500' :
                            (risk.score || 0) <= 7 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></div>
                        {risk.level?.toUpperCase() || 'CALCULANDO'}
                    </div>
                    <span className="text-xs font-medium text-slate-400 ml-2">{risk.action}</span>
                </div>
            </div>

            {/* Bilateral Posture */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                            <User size={18} className="text-blue-500" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Hombros</h3>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                        <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">Altura Izq: <span className="text-slate-800 font-bold">{Math.round(angles.shoulder_height_l || 0)}</span></span>
                        <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">Altura Der: <span className="text-slate-800 font-bold">{Math.round(angles.shoulder_height_r || 0)}</span></span>
                    </div>

                    <div className="relative h-3 bg-slate-100 rounded-full w-full overflow-hidden border border-slate-200">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 transform -translate-x-1/2 z-10"></div>
                        <div
                            className={`absolute top-0 bottom-0 w-8 rounded-full transition-all duration-500 ease-out transform -translate-x-1/2 ${Math.abs(symmetry) > 10 ? 'bg-rose-400' : 'bg-blue-400'}`}
                            style={{ left: `${symmetryPos}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-center">
                        <p className={`text-xs font-semibold px-3 py-1 rounded-full ${Math.abs(symmetry) < 5 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                            {Math.abs(symmetry) < 5 ? 'Perfectamente Alineado' : symmetry > 0 ? 'Hombro Izq. Elevado ⚠️' : 'Hombro Der. Elevado ⚠️'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Axial Segments (Grupo A) */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                            <Activity size={18} className="text-purple-500" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Eje Central (A)</h3>
                    </div>
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Puntaje A:</span>
                            <span className="text-sm font-black text-purple-600">{risk.subScores.scoreA}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-slate-600">Inclinación Cervical</span>
                            <div className="flex items-center gap-3">
                                {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">Pts: {risk.subScores.neck}</span>}
                                <span className={`text-base font-black ${neckDisplay > 20 ? 'text-rose-500' : 'text-purple-600'}`}>{Math.round(neckDisplay || 0)}°</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${neckDisplay > 20 ? 'bg-rose-400' : 'bg-purple-400'}`}
                                style={{ width: `${Math.min(100, (neckDisplay / 45) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-slate-600">Flexión de Tronco</span>
                            <div className="flex items-center gap-3">
                                {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">Pts: {risk.subScores.trunk}</span>}
                                <span className={`text-base font-black ${trunkDisplay > 20 ? 'text-rose-500' : 'text-amber-500'}`}>{Math.round(trunkDisplay || 0)}°</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${trunkDisplay > 20 ? 'bg-rose-400' : 'bg-amber-400'}`}
                                style={{ width: `${Math.min(100, (trunkDisplay / 90) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upper Extremities */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                            <Activity size={18} className="text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">M. Superiores (B)</h3>
                    </div>
                    {/* Score B Badge */}
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Puntaje B:</span>
                            <span className="text-sm font-black text-indigo-600">{risk.subScores.scoreB}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Hombros (Brazos REBA) */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-600">Brazos (Elevación)</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">Pts: {risk.subScores.upperArm}</span>}
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.shoulder_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.shoulder_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Codos / Antebrazos */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-600">Antebrazos (Ángulo)</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">Pts: {risk.subScores.lowerArm}</span>}
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.elbow_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.elbow_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Muñecas */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-600">Muñecas</span>
                            {risk.subScores && <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">Pts: {risk.subScores.wrist}</span>}
                        </div>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.wrist_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.wrist_r || 0)}°</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lower Extremities */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100">
                            <Activity size={18} className="text-teal-500" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Miembros Inferiores</h3>
                    </div>
                    {/* Legs Score Badge */}
                    {risk.subScores && (
                        <div className="px-3 py-1 bg-teal-50 border border-teal-100 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Pts Piernas:</span>
                            <span className="text-sm font-black text-teal-600">{risk.subScores.legs}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Piernas / Cadera */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600">Piernas / Cadera</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.hip_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.hip_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Rodillas */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600">Rodillas</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.knee_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.knee_r || 0)}°</span></span>
                        </div>
                    </div>

                    {/* Tobillos */}
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-600">Tobillos</span>
                        <div className="flex gap-2 text-sm font-medium text-slate-400">
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Izq: <span className="text-slate-800 font-bold block">{Math.round(angles.ankle_l || 0)}°</span></span>
                            <span className="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">Der: <span className="text-slate-800 font-bold block">{Math.round(angles.ankle_r || 0)}°</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segment Traffic Light */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Activity size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Semáforo Segmentario</h3>
                </div>

                <div className="space-y-2.5">
                    {segments.map((segment) => {
                        const data = segmentStatus[segment.key] || { status: 'ok', value: 0 };
                        const status = normalizeStatus(data);
                        return (
                            <div key={segment.key} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                <span className="text-sm text-slate-600 font-medium">{segment.label}</span>
                                <div className={`px-2.5 py-1 text-xs rounded-md border font-bold ${statusStyles[status]}`}>
                                    {Math.round(data.value || 0)}{segment.unit}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Risk trend */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Tendencia de Riesgo (6 min)</h3>
                {trendData.length > 0 ? (
                    <div className="flex items-end gap-1 h-20">
                        {trendData.map((point, idx) => {
                            const barHeight = Math.max(8, (point.score / 15) * 100);
                            const color = point.score >= 10 ? 'bg-rose-500' : point.score >= 6 ? 'bg-amber-400' : 'bg-emerald-400';
                            return (
                                <div key={`${point.second}-${idx}`} className="flex-1 flex items-end h-full">
                                    <div className={`w-full rounded-sm ${color} opacity-85`} style={{ height: `${barHeight}%` }} title={`t=${point.second}s · REBA=${point.score}`} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400">Aún no hay datos suficientes para tendencia.</p>
                )}
            </div>

            {/* Print button */}
            <button
                onClick={() => (onPrint ? onPrint() : window.print())}
                className="mt-2 mb-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-[0.98] print:hidden"
            >
                <FileText size={20} />
                Imprimir reporte PDF
            </button>
        </aside>
    );
};

export default MetricsPanel;
