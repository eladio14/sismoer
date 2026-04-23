import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowRight, KeyRound, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../utils/storageService';

const AuthModal = ({ isOpen, onClose, onSuccess, defaultIsLogin = true }) => {
    // Modes: 'login' | 'register' | 'forgot-email' | 'forgot-reset' | 'forgot-success'
    const [mode, setMode] = useState(defaultIsLogin ? 'login' : 'register');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryUserName, setRecoveryUserName] = useState('');

    const { login, register } = useAuth();

    if (!isOpen) return null;

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setRecoveryEmail('');
        setRecoveryUserName('');
    };

    const goToMode = (newMode) => {
        setError('');
        setMode(newMode);
    };

    // --- Login / Register ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password || (mode === 'register' && !name)) {
            setError('Todos los campos son obligatorios.');
            setLoading(false);
            return;
        }

        if (mode === 'register' && password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        let result;
        if (mode === 'login') {
            result = await login(email, password);
        } else {
            result = await register(name, email, password);
        }

        if (result.success) {
            clearForm();
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // --- Forgot: Step 1 - Verify email ---
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!recoveryEmail) {
            setError('Ingresa tu correo electrónico.');
            setLoading(false);
            return;
        }

        try {
            const result = await storageService.checkEmailExists(recoveryEmail);
            setRecoveryUserName(result.name);
            setMode('forgot-reset');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Forgot: Step 2 - Set new password ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!password) {
            setError('Ingresa tu nueva contraseña.');
            setLoading(false);
            return;
        }
        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres.');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            await storageService.resetPassword(recoveryEmail, password);
            setMode('forgot-success');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Titles by mode ---
    const titles = {
        'login': 'Iniciar Sesión',
        'register': 'Crear Cuenta',
        'forgot-email': 'Recuperar Contraseña',
        'forgot-reset': 'Nueva Contraseña',
        'forgot-success': 'Contraseña Actualizada'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-fade-in-scale">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        {(mode === 'forgot-email' || mode === 'forgot-reset') && (
                            <button
                                onClick={() => goToMode(mode === 'forgot-reset' ? 'forgot-email' : 'login')}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold font-outfit text-slate-800">
                            {titles[mode]}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">

                    {/* ====== LOGIN / REGISTER ====== */}
                    {(mode === 'login' || mode === 'register') && (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {mode === 'register' && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-600 ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ej. Juan Pérez"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600 ml-1">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {mode === 'register' && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-600 ml-1">Confirmar Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2">
                                        <span className="font-semibold block shrink-0 mt-0.5">!</span>
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-6
                                        ${loading ? 'bg-emerald-300 text-white cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:-translate-y-0.5 hover:shadow-emerald-500/30'}`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Ingresar a SMEP' : 'Crear mi cuenta SMEP'}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Forgot Password Link (only in login mode) */}
                            {mode === 'login' && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => {
                                            clearForm();
                                            goToMode('forgot-email');
                                        }}
                                        className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors underline-offset-4 hover:underline focus:outline-none"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            )}

                            {/* Toggle Login/Register */}
                            <div className="mt-4 text-center text-slate-500 text-sm">
                                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
                                <button
                                    onClick={() => {
                                        goToMode(mode === 'login' ? 'register' : 'login');
                                        setError('');
                                    }}
                                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors underline-offset-4 hover:underline focus:outline-none"
                                >
                                    {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* ====== FORGOT: STEP 1 — EMAIL VERIFICATION ====== */}
                    {mode === 'forgot-email' && (
                        <>
                            <div className="flex justify-center mb-5">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <KeyRound size={32} className="text-blue-500 text-blue-600" />
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
                                Ingresa el correo electrónico asociado a tu cuenta. Verificaremos que exista y te permitiremos establecer una nueva contraseña.
                            </p>

                            <form onSubmit={handleVerifyEmail} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                            autoFocus
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2">
                                        <span className="font-semibold block shrink-0 mt-0.5">!</span>
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-2
                                        ${loading ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5 shadow-md'}`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            Verificar Correo
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-5 text-center">
                                <button
                                    onClick={() => {
                                        clearForm();
                                        goToMode('login');
                                    }}
                                    className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
                                >
                                    Volver a Iniciar Sesión
                                </button>
                            </div>
                        </>
                    )}

                    {/* ====== FORGOT: STEP 2 — SET NEW PASSWORD ====== */}
                    {mode === 'forgot-reset' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <ShieldCheck size={28} className="text-emerald-600" />
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-5 text-center">
                                <p className="text-emerald-700 text-sm font-medium">
                                    Cuenta verificada: <span className="text-slate-800 font-bold">{recoveryUserName}</span>
                                </p>
                                <p className="text-emerald-600 text-xs mt-0.5">{recoveryEmail}</p>
                            </div>

                            <p className="text-slate-500 text-sm text-center mb-5">
                                Establece tu nueva contraseña a continuación.
                            </p>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600 ml-1">Nueva Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoFocus
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-600 ml-1">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex items-start gap-2">
                                        <span className="font-semibold block shrink-0 mt-0.5">!</span>
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-2
                                        ${loading ? 'bg-emerald-300 text-white cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:-translate-y-0.5 shadow-md'}`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <KeyRound className="w-5 h-5" />
                                            Restablecer Contraseña
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ====== FORGOT: SUCCESS ====== */}
                    {mode === 'forgot-success' && (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-5">
                                <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Contraseña Actualizada!</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                            </p>

                            <button
                                onClick={() => {
                                    clearForm();
                                    goToMode('login');
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Ir a Iniciar Sesión
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuthModal;
