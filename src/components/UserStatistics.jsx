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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-8">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-4xl max-h-full flex flex-col shadow-[0_8px_64px_rgba(0,0,0,0.5)] animate-fade-in-scale">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/[0.06] shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                            Mis Estadísticas
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Historial de monitoreo ergonómico de {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20">
                            <ShieldCheck className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-300">Sin registros</h3>
                            <p className="text-slate-500 mt-2">Inicia un monitoreo y guárdalo para ver tus estadísticas aquí.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* General Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1">Sesiones Monitoreadas</div>
                                    <div className="text-2xl font-bold text-white">{totalSessions}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Tiempo Total</div>
                                    <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Postura Correcta</div>
                                    <div className="text-2xl font-bold text-white">{goodTimePercentage}%</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-400" /> Score REBA Promedio</div>
                                    <div className="text-2xl font-bold text-white">{avgScore}</div>
                                </div>
                            </div>

                            {/* History Table */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Historial Reciente</h3>
                                <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                                                <th className="p-4 font-medium">Fecha</th>
                                                <th className="p-4 font-medium">Duración</th>
                                                <th className="p-4 font-medium">Puntaje Máx</th>
                                                <th className="p-4 font-medium">Tiempo en Riesgo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((record) => (
                                                <tr key={record.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                                                    <td className="p-4 text-slate-300">
                                                        {new Date(record.date).toLocaleDateString()} a las {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="p-4 text-slate-300">{formatTime(record.data.sessionTime)}</td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${record.data.finalScore <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                                                                record.data.finalScore <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {record.data.finalScore}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-300">
                                                        {record.data.badPostureTime > 0 ? (
                                                            <span className="text-red-400">{formatTime(record.data.badPostureTime)}</span>
                                                        ) : (
                                                            <span className="text-emerald-400">0s</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
