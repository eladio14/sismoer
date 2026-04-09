import React from 'react';
import { getProfileRecommendations } from '../utils/ergonomics';

const RebaReport = ({ angles, risk, settings, riskHistory = [], segmentStatus = {}, reportImage }) => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES');

    // If risk is not yet populated with REBA data, return null
    if (!risk?.subScores) return null;

    const { subScores } = risk;
    const profileName = settings?.workProfile || 'oficina';
    const profileRecommendations = getProfileRecommendations(profileName);
    const avgScore = riskHistory.length > 0
        ? (riskHistory.reduce((acc, item) => acc + item.score, 0) / riskHistory.length).toFixed(1)
        : risk.score;
    const maxScore = riskHistory.length > 0
        ? Math.max(...riskHistory.map(item => item.score))
        : risk.score;

    return (
        <div className="print-report hidden print:block w-full text-black bg-white p-6 font-sans h-auto">
            <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-1 text-slate-900">Reporte de Evaluación Ergonómica</h1>
                    <h2 className="text-xl text-slate-600 font-semibold">Método R.E.B.A.</h2>
                </div>
                <div className="text-right text-sm text-slate-500">
                    <p><strong>Fecha y Hora:</strong> {dateStr}</p>
                    <p><strong>Analista:</strong> Sistema SMEP</p>
                </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-4 mb-6">
                <h4 className="text-base font-bold bg-slate-100 -mx-4 -mt-4 p-2 mb-4 rounded-t-lg border-b border-slate-300 text-center">Evidencia Visual de Postura</h4>
                {reportImage ? (
                    <img
                        src={reportImage}
                        alt="Captura de postura"
                        className="w-full max-h-[220px] object-contain border border-slate-200 rounded"
                    />
                ) : (
                    <div className="w-full h-36 border border-dashed border-slate-300 rounded flex items-center justify-center text-sm text-slate-500">
                        Sin imagen disponible. Inicia monitoreo unos segundos antes de imprimir.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Grupo A */}
                <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-lg font-bold bg-slate-100 -mx-4 -mt-4 p-2 mb-4 rounded-t-lg border-b border-slate-300 text-center">Grupo A: Tronco, Cuello y Piernas</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Cuello</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.neck}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Tronco</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.trunk}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Piernas</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.legs}</td>
                            </tr>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <td className="py-2 px-2 font-semibold text-slate-700">Puntaje Tabla A</td>
                                <td className="py-2 px-2 text-right font-black text-xl text-blue-800">{subScores.scoreA}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium text-slate-500 text-xs">+ Carga/Fuerza</td>
                                <td className="py-2 text-right font-medium text-slate-500">0</td>
                            </tr>
                            <tr className="bg-blue-100/50">
                                <td className="py-2 px-2 font-bold">Puntuación A Final</td>
                                <td className="py-2 px-2 text-right font-black text-2xl text-blue-900">{subScores.scoreA}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Grupo B */}
                <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-lg font-bold bg-slate-100 -mx-4 -mt-4 p-2 mb-4 rounded-t-lg border-b border-slate-300 text-center">Grupo B: Brazos, Antebrazos, Muñecas</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Brazos</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.upperArm}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Antebrazos</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.lowerArm}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium">Puntuación Muñecas</td>
                                <td className="py-2 text-right font-bold text-lg">{subScores.wrist}</td>
                            </tr>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <td className="py-2 px-2 font-semibold text-slate-700">Puntaje Tabla B</td>
                                <td className="py-2 px-2 text-right font-black text-xl text-blue-800">{subScores.scoreB}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 font-medium text-slate-500 text-xs">+ Agarre</td>
                                <td className="py-2 text-right font-medium text-slate-500">0</td>
                            </tr>
                            <tr className="bg-blue-100/50">
                                <td className="py-2 px-2 font-bold">Puntuación B Final</td>
                                <td className="py-2 px-2 text-right font-black text-2xl text-blue-900">{subScores.scoreB}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resultado Final */}
            <div className="flex flex-col items-center justify-center p-6 border-4 border-slate-800 rounded-2xl bg-slate-50 mb-8">
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Puntuación REBA Final</h3>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-8xl font-black text-slate-900 leading-none">{risk.score}</span>
                    <span className="text-2xl font-bold text-slate-400 mb-2">/ 15</span>
                </div>

                <div className="flex w-full justify-between items-center px-8 mt-4 gap-4">
                    <div className="flex-1 text-center p-3 rounded bg-white shadow-sm border border-slate-200">
                        <p className="text-sm font-bold text-slate-500 uppercase">Nivel de Riesgo</p>
                        <p className="text-xl font-black text-slate-800">{risk.level}</p>
                    </div>

                    <div className="flex-1 text-center p-3 rounded bg-slate-100 border border-slate-300 text-slate-800 shadow-sm">
                        <p className="text-sm font-bold text-slate-500 uppercase">Acción Requerida</p>
                        <p className="text-lg font-bold">{risk.action}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-slate-300 rounded-lg p-4">
                    <h4 className="text-base font-bold bg-slate-100 -mx-4 -mt-4 p-2 mb-4 rounded-t-lg border-b border-slate-300 text-center">Indicadores de Tendencia</h4>
                    <p className="text-sm mb-2"><strong>Perfil ergonómico:</strong> {profileName}</p>
                    <p className="text-sm mb-2"><strong>Promedio sesión:</strong> REBA {avgScore}</p>
                    <p className="text-sm"><strong>Pico detectado:</strong> REBA {maxScore}</p>
                </div>

                <div className="border border-slate-300 rounded-lg p-4">
                    <h4 className="text-base font-bold bg-slate-100 -mx-4 -mt-4 p-2 mb-4 rounded-t-lg border-b border-slate-300 text-center">Semáforo Segmentario</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(segmentStatus).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value?.status || 'ok'} ({Math.round(value?.value || 0)})</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border border-slate-200 rounded p-4 mb-8">
                <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">Recomendaciones Personalizadas</h4>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1.5">
                    {(risk.recommendations || []).slice(0, 4).map((rec, idx) => (
                        <li key={`risk-${idx}`}>{rec}</li>
                    ))}
                    {profileRecommendations.map((rec, idx) => (
                        <li key={`profile-${idx}`}>{rec}</li>
                    ))}
                </ul>
            </div>

            {/* Mediciones Crudas */}
            <div className="border border-slate-200 rounded p-4">
                <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">Detalle de Ángulos (Mediciones Biométrica)</h4>
                <div className="grid grid-cols-3 gap-y-2 text-xs text-slate-600">
                    <p><strong>Tronco:</strong> {Math.round(angles.trunk)}°</p>
                    <p><strong>Cuello:</strong> {Math.round(angles.neck)}°</p>
                    <div></div>
                    <p><strong>Elevación Brazo Izq:</strong> {Math.round(angles.shoulder_l || 0)}°</p>
                    <p><strong>Codo Izq:</strong> {Math.round(angles.elbow_l)}°</p>
                    <p><strong>Muñeca Izq:</strong> {Math.round(angles.wrist_l)}°</p>
                    <p><strong>Elevación Brazo Der:</strong> {Math.round(angles.shoulder_r || 0)}°</p>
                    <p><strong>Codo Der:</strong> {Math.round(angles.elbow_r)}°</p>
                    <p><strong>Muñeca Der:</strong> {Math.round(angles.wrist_r)}°</p>
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-12 italic">
                Reporte generado por SMEP (Sistema de Monitoreo Ergonómico de Postura) - Tecnología MediaPipe.
            </p>
        </div>
    );
};

export default RebaReport;
