import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, onSuccess, defaultIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password || (!isLogin && !name)) {
            setError('Todos los campos son obligatorios.');
            setLoading(false);
            return;
        }

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(name, email, password);
        }

        if (result.success) {
            // Limpiar y cerrar
            setName('');
            setEmail('');
            setPassword('');
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-md shadow-[0_8px_64px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-scale">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/[0.06]">
                    <h2 className="text-2xl font-bold font-outfit text-white">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Ej. Juan Pérez"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-start gap-2">
                                <span className="font-semibold block shrink-0 mt-0.5">!</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-6
                                ${loading ? 'bg-emerald-500/50 text-emerald-100 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'}`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Ingresar a SMEP' : 'Crear mi cuenta SMEP'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center text-slate-400 text-sm">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors underline-offset-4 hover:underline focus:outline-none"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
