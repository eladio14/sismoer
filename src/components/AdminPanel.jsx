import React, { useEffect, useState } from 'react';
import { X, Users, Clock, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import { storageService } from '../utils/storageService';
import { useAuth } from '../context/AuthContext';

const AdminPanel = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('global'); // 'global' | 'users'

    useEffect(() => {
        if (isOpen && user?.role === 'admin') {
            loadGlobalData();
        }
    }, [isOpen, user]);

    const loadGlobalData = async () => {
        setLoading(true);
        try {
            const hData = await storageService.getAllHistory();
            const uData = await storageService.getAllUsers();
            setHistory(hData);
            setUsers(uData.filter(u => u.role !== 'admin'));
        } catch (error) {
            console.error("Error al cargar datos globales", error);
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
    const uniqueUsers = new Set();

    history.forEach(session => {
        totalTime += session.data.sessionTime || 0;
        totalBadTime += session.data.badPostureTime || 0;
        avgScore += session.data.finalScore || 0;
        if (session.userId) {
            uniqueUsers.add(session.userId);
        }
    });

    avgScore = totalSessions > 0 ? (avgScore / totalSessions).toFixed(1) : 0;
    const totalUniqueUsers = uniqueUsers.size;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return mins > 0 ? `${mins}m ${seconds % 60}s` : `${seconds}s`;
    };

    const goodTimePercentage = totalTime > 0 ? Math.round(((totalTime - totalBadTime) / totalTime) * 100) : 100;

    const userStats = users.map(u => {
        const userHistory = history.filter(h => h.userId === u.id);
        const totalSess = userHistory.length;
        let time = 0;
        let badTime = 0;
        let scoreSum = 0;
        userHistory.forEach(s => {
            time += (s.data.sessionTime || 0);
            badTime += (s.data.badPostureTime || 0);
            scoreSum += (s.data.finalScore || 0);
        });
        const uAvgScore = totalSess > 0 ? (scoreSum / totalSess).toFixed(1) : 0;
        return {
            ...u,
            totalSessions: totalSess,
            totalTime: time,
            badTime,
            avgScore: uAvgScore
        };
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-8">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-5xl max-h-full flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-800 shrink-0 gap-4 sm:gap-0">
                    <div>
                        <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
                            <Database className="w-6 h-6 text-emerald-400" />
                            Panel de Administración
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Métricas, valoraciones y riesgo ergonómico general
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 flex">
                            <button
                                onClick={() => setViewMode('global')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'global' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Historial Global
                            </button>
                            <button
                                onClick={() => setViewMode('users')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'users' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Usuarios
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* General Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-400" /> Usuarios</div>
                                    <div className="text-2xl font-bold text-white">{totalUniqueUsers} / {users.length}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1">Total Sesiones</div>
                                    <div className="text-2xl font-bold text-white">{totalSessions}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Tiempo Global</div>
                                    <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-400" /> Postura Correcta</div>
                                    <div className="text-2xl font-bold text-white">{goodTimePercentage}%</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-400" /> Score REBA Global</div>
                                    <div className="text-2xl font-bold text-white">{avgScore}</div>
                                </div>
                            </div>

                            {/* View Content */}
                            {viewMode === 'global' ? (
                                history.length === 0 ? (
                                    <div className="text-center py-10">
                                        <h3 className="text-lg text-slate-400">No hay sesiones aún.</h3>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Registro Completo de Evaluaciones</h3>
                                        <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                                    <thead>
                                                        <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                                                            <th className="p-4 font-medium">Empleado</th>
                                                            <th className="p-4 font-medium">Fecha</th>
                                                            <th className="p-4 font-medium">Duración</th>
                                                            <th className="p-4 font-medium">Score Final</th>
                                                            <th className="p-4 font-medium">Tiempo en Riesgo</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {history.map((record) => (
                                                            <tr key={record.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                                                                <td className="p-4">
                                                                    <div className="text-slate-200 font-medium">{record.userName}</div>
                                                                    <div className="text-slate-500 text-xs">{record.userEmail}</div>
                                                                </td>
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
                                                                        <span className="text-red-400 font-medium">{formatTime(record.data.badPostureTime)}</span>
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
                                )
                            ) : (
                                users.length === 0 ? (
                                    <div className="text-center py-10">
                                        <h3 className="text-lg text-slate-400">No hay usuarios registrados.</h3>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">Valoración de Riesgo por Usuario</h3>
                                        <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                                    <thead>
                                                        <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                                                            <th className="p-4 font-medium">Empleado</th>
                                                            <th className="p-4 font-medium">Sesiones</th>
                                                            <th className="p-4 font-medium">Tiempo Monitoreado</th>
                                                            <th className="p-4 font-medium">Score Promedio</th>
                                                            <th className="p-4 font-medium">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userStats.map((u) => (
                                                            <tr key={u.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                                                                <td className="p-4">
                                                                    <div className="text-slate-200 font-medium">{u.name}</div>
                                                                    <div className="text-slate-500 text-xs">{u.email}</div>
                                                                </td>
                                                                <td className="p-4 text-slate-300">{u.totalSessions}</td>
                                                                <td className="p-4 text-slate-300">{formatTime(u.totalTime)}</td>
                                                                <td className="p-4">
                                                                    {u.totalSessions > 0 ? (
                                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${u.avgScore <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                                                                                u.avgScore <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                                                            }`}>
                                                                            {u.avgScore}
                                                                        </span>
                                                                    ) : <span className="text-slate-500">-</span>}
                                                                </td>
                                                                <td className="p-4">
                                                                    {u.totalSessions === 0 ? (
                                                                        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs">Sin Evaluar</span>
                                                                    ) : u.avgScore <= 3 ? (
                                                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">Riesgo Bajo</span>
                                                                    ) : u.avgScore <= 7 ? (
                                                                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">Riesgo Medio</span>
                                                                    ) : (
                                                                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium border border-red-500/30">Riesgo Alto</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
