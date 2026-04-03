import React, { useEffect, useState } from 'react';
import {
    X, Users, BarChart2, ShieldCheck, Clock,
    AlertTriangle, Lock, Loader2, Activity, CheckCircle
} from 'lucide-react';
import { storageService } from '../utils/storageService';
import { useAuth } from '../context/AuthContext';

// Simulated work-position distribution data.
// Work profiles are configured per device and not stored per session, so this
// dataset uses representative placeholder values to illustrate the feature.
// Replace with real aggregated data once work profiles are persisted per session.
const SIMULATED_POSITIONS = [
    { key: 'oficina',     label: 'Oficina',      sessions: 42, avgScore: 4.2, barColor: 'bg-blue-500',    textColor: 'text-blue-400' },
    { key: 'callcenter',  label: 'Call Center',  sessions: 28, avgScore: 5.8, barColor: 'bg-purple-500',  textColor: 'text-purple-400' },
    { key: 'diseno',      label: 'Diseño',       sessions: 19, avgScore: 3.9, barColor: 'bg-amber-500',   textColor: 'text-amber-400' },
    { key: 'desarrollo',  label: 'Desarrollo',   sessions: 31, avgScore: 4.7, barColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
];

const UNKNOWN_USER_LABEL = 'Desconocido';

const MAX_POSITION_SESSIONS = Math.max(...SIMULATED_POSITIONS.map(p => p.sessions));

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins}m ${seconds % 60}s` : `${seconds}s`;
};

const AdminPanel = ({ isOpen, onClose }) => {
    const { user, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [allUsers, setAllUsers]   = useState([]);
    const [allHistory, setAllHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Change-password form state
    const [currentPassword,  setCurrentPassword]  = useState('');
    const [newPassword,      setNewPassword]       = useState('');
    const [confirmPassword,  setConfirmPassword]   = useState('');
    const [pwLoading,        setPwLoading]         = useState(false);
    const [pwError,          setPwError]           = useState('');
    const [pwSuccess,        setPwSuccess]         = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadAdminData();
        }
    }, [isOpen]);

    const loadAdminData = async () => {
        setLoading(true);
        try {
            const [users, history] = await Promise.all([
                storageService.getAllUsers(),
                storageService.getAllHistory(),
            ]);
            setAllUsers(users);
            setAllHistory(history);
        } catch (error) {
            console.error('Error loading admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPwError('Todos los campos son obligatorios.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
        if (newPassword.length < 6) {
            setPwError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setPwLoading(true);
        const result = await changePassword(user.id, currentPassword, newPassword);
        setPwLoading(false);

        if (result.success) {
            setPwSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPwError(result.error);
        }
    };

    if (!isOpen) return null;

    // --- Computed stats ---
    const regularUsers         = allUsers.filter(u => u.role !== 'admin');
    const totalSessions        = allHistory.length;
    const totalTime            = allHistory.reduce((acc, s) => acc + (s.data.sessionTime    || 0), 0);
    const totalBadTime         = allHistory.reduce((acc, s) => acc + (s.data.badPostureTime || 0), 0);
    const avgScore             = totalSessions > 0
        ? (allHistory.reduce((acc, s) => acc + (s.data.finalScore || 0), 0) / totalSessions).toFixed(1)
        : 0;
    const goodPosturePercent   = totalTime > 0
        ? Math.round(((totalTime - totalBadTime) / totalTime) * 100)
        : 100;

    const TABS = [
        { id: 'stats',    label: 'Estadísticas',      Icon: BarChart2 },
        { id: 'users',    label: 'Usuarios',           Icon: Users },
        { id: 'password', label: 'Cambiar Contraseña', Icon: Lock },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-8">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-5xl max-h-full flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
                                Panel de Administrador
                                <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                    ADMIN
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm mt-0.5">Bienvenido, {user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 px-6 shrink-0">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                activeTab === id
                                    ? 'border-amber-500 text-amber-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* ── Statistics Tab ── */}
                            {activeTab === 'stats' && (
                                <div className="space-y-8">
                                    {/* System summary */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-amber-400" />
                                            Resumen del Sistema
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5" /> Usuarios Registrados
                                                </div>
                                                <div className="text-2xl font-bold text-white">{regularUsers.length}</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1.5">
                                                    <BarChart2 className="w-3.5 h-3.5" /> Sesiones Totales
                                                </div>
                                                <div className="text-2xl font-bold text-white">{totalSessions}</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1.5">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Postura Correcta
                                                </div>
                                                <div className="text-2xl font-bold text-white">{goodPosturePercent}%</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Score REBA Promedio
                                                </div>
                                                <div className="text-2xl font-bold text-white">{avgScore}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work-position distribution */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                                            <BarChart2 className="w-5 h-5 text-amber-400" />
                                            Posiciones en Sitios de Trabajo
                                        </h3>
                                        <p className="text-slate-500 text-xs mb-4">Datos representativos del sistema</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {SIMULATED_POSITIONS.map(pos => (
                                                <div key={pos.key} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className={`text-sm font-semibold ${pos.textColor}`}>{pos.label}</span>
                                                        <span className="text-slate-400 text-xs">
                                                            {pos.sessions} sesiones · REBA avg {pos.avgScore}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className={`${pos.barColor} h-2 rounded-full transition-all duration-500`}
                                                            style={{ width: `${(pos.sessions / MAX_POSITION_SESSIONS) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent sessions (all users) */}
                                    {allHistory.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-amber-400" />
                                                Sesiones Recientes (Todos los Usuarios)
                                            </h3>
                                            <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                                                            <th className="p-4 font-medium">Fecha</th>
                                                            <th className="p-4 font-medium">Usuario</th>
                                                            <th className="p-4 font-medium">Duración</th>
                                                            <th className="p-4 font-medium">Score REBA</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allHistory.slice(0, 10).map(record => {
                                                            const sessionUser = allUsers.find(u => u.id === record.userId);
                                                            return (
                                                                <tr key={record.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                                                                    <td className="p-4 text-slate-300 text-sm">
                                                                        {new Date(record.date).toLocaleDateString()}{' '}
                                                                        {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </td>
                                                                    <td className="p-4 text-slate-300 text-sm">{sessionUser?.name || UNKNOWN_USER_LABEL}</td>
                                                                    <td className="p-4 text-slate-300 text-sm">{formatTime(record.data.sessionTime)}</td>
                                                                    <td className="p-4">
                                                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                                            record.data.finalScore <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                                                                            record.data.finalScore <= 7 ? 'bg-amber-500/20 text-amber-400' :
                                                                            'bg-red-500/20 text-red-400'
                                                                        }`}>
                                                                            {record.data.finalScore}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Users Tab ── */}
                            {activeTab === 'users' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-amber-400" />
                                        Usuarios Registrados
                                        <span className="text-sm text-slate-400 font-normal">({regularUsers.length} usuarios)</span>
                                    </h3>
                                    {regularUsers.length === 0 ? (
                                        <div className="text-center py-16">
                                            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-400">No hay usuarios registrados aún.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                                                        <th className="p-4 font-medium">Nombre</th>
                                                        <th className="p-4 font-medium">Correo</th>
                                                        <th className="p-4 font-medium">Rol</th>
                                                        <th className="p-4 font-medium">Sesiones</th>
                                                        <th className="p-4 font-medium">Registrado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {regularUsers.map(u => {
                                                        const userSessions = allHistory.filter(h => h.userId === u.id).length;
                                                        return (
                                                            <tr key={u.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                                                                <td className="p-4 text-white font-medium text-sm">{u.name}</td>
                                                                <td className="p-4 text-slate-400 text-sm">{u.email}</td>
                                                                <td className="p-4">
                                                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                                        Usuario
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-slate-300 text-sm">{userSessions}</td>
                                                                <td className="p-4 text-slate-400 text-sm">
                                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Change Password Tab ── */}
                            {activeTab === 'password' && (
                                <div className="max-w-md">
                                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-amber-400" />
                                        Cambiar Contraseña
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6">Actualiza la contraseña del administrador.</p>

                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Contraseña Actual</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={e => setCurrentPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Nueva Contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Confirmar Nueva Contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {pwError && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-start gap-2">
                                                <span className="font-semibold block shrink-0 mt-0.5">!</span>
                                                <p>{pwError}</p>
                                            </div>
                                        )}

                                        {pwSuccess && (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-xl flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 shrink-0" />
                                                <p>Contraseña actualizada exitosamente.</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={pwLoading}
                                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-2 ${
                                                pwLoading
                                                    ? 'bg-amber-500/50 text-amber-100 cursor-not-allowed'
                                                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20'
                                            }`}
                                        >
                                            {pwLoading
                                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                                : 'Actualizar Contraseña'
                                            }
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
