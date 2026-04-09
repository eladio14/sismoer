import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { storageService } from '../utils/storageService';
import { useAuth } from '../context/AuthContext';

const UserStatistics = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            loadHistory();
        }
    }, [isOpen, user]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await storageService.getUserHistory(user.id);
            setHistory(data);
        } catch (error) {
            console.error("Error al cargar historial", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Calcular estadísticas globales
    const totalSessions = history.length;
    let totalTime = 0;
    let totalBadTime = 0;
    let avgScore = 0;

    history.forEach(session => {
        totalTime += session.data.sessionTime || 0;
        totalBadTime += session.data.badPostureTime || 0;
        avgScore += session.data.finalScore || 0;
    });

    avgScore = totalSessions > 0 ? (avgScore / totalSessions).toFixed(1) : 0;
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return mins > 0 ? `${mins}m ${seconds % 60}s` : `${seconds}s`;
    };

    const goodTimePercentage = totalTime > 0 ? Math.round(((totalTime - totalBadTime) / totalTime) * 100) : 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-full flex flex-col shadow-2xl animate-fade-in-scale">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold font-outfit text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            Mis Estadísticas
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Historial de monitoreo ergonómico de {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20">
                            <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-600">Sin registros</h3>
                            <p className="text-slate-400 mt-2">Inicia un monitoreo y guárdalo para ver tus estadísticas aquí.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* General Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="text-slate-500 text-sm mb-1">Sesiones Monitoreadas</div>
                                    <div className="text-2xl font-bold text-slate-800">{totalSessions}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="text-slate-500 text-sm mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Tiempo Total</div>
                                    <div className="text-2xl font-bold text-slate-800">{formatTime(totalTime)}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="text-slate-500 text-sm mb-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Postura Correcta</div>
                                    <div className="text-2xl font-bold text-slate-800">{goodTimePercentage}%</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="text-slate-500 text-sm mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> Score REBA Promedio</div>
                                    <div className="text-2xl font-bold text-slate-800">{avgScore}</div>
                                </div>
                            </div>

                            {/* History Table */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Historial Reciente</h3>
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse whitespace-nowrap">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                                <th className="p-4 font-medium">Fecha</th>
                                                <th className="p-4 font-medium">Duración</th>
                                                <th className="p-4 font-medium">Score REBA</th>
                                                <th className="p-4 font-medium">Pico REBA</th>
                                                <th className="p-4 font-medium">Postura Correcta</th>
                                                <th className="p-4 font-medium">Tiempo en Riesgo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((record) => {
                                                const goodPct = record.data.sessionTime > 0
                                                    ? Math.round(((record.data.goodPostureTime || (record.data.sessionTime - (record.data.badPostureTime || 0))) / record.data.sessionTime) * 100)
                                                    : 100;
                                                return (
                                                <tr key={record.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-600">
                                                        {new Date(record.date).toLocaleDateString()} a las {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="p-4 text-slate-600">{formatTime(record.data.sessionTime)}</td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${record.data.finalScore <= 3 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                                record.data.finalScore <= 7 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200'
                                                            }`}>
                                                            {record.data.finalScore}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {record.data.peakScore != null ? (
                                                            <span className={`text-sm font-semibold ${record.data.peakScore <= 3 ? 'text-emerald-600' :
                                                                record.data.peakScore <= 7 ? 'text-amber-600' : 'text-rose-600'
                                                            }`}>
                                                                {record.data.peakScore}
                                                            </span>
                                                        ) : <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${goodPct >= 80 ? 'bg-emerald-500' : goodPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                    style={{ width: `${goodPct}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-semibold ${goodPct >= 80 ? 'text-emerald-600' : goodPct >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{goodPct}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {record.data.badPostureTime > 0 ? (
                                                            <span className="text-red-500 font-medium">{formatTime(record.data.badPostureTime)}</span>
                                                        ) : (
                                                            <span className="text-emerald-600">0s</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStatistics;
