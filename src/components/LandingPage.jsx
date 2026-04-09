import React, { useState } from 'react';
import { Activity, Shield, Zap, ChevronRight, MonitorPlay, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
    <div className="group relative bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
        {/* Gradient accent top-left */}
        <div className={`absolute top-0 left-0 w-24 h-24 ${gradient} rounded-br-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
        <div className={`relative w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center mb-5 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 font-outfit">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
);

const LandingPage = ({ onStart }) => {
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalIsLogin, setAuthModalIsLogin] = useState(true);

    const openLogin = () => { setAuthModalIsLogin(true); setIsAuthModalOpen(true); };
    const openRegister = () => { setAuthModalIsLogin(false); setIsAuthModalOpen(true); };

    const handleStart = () => {
        if (!user) { openLogin(); } else { onStart(); }
    };

    return (
        <div className="min-h-screen w-full relative flex flex-col items-center overflow-x-hidden font-inter"
            style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #fafcff 40%, #f5f0ff 70%, #edfaf5 100%)' }}>

            {/* Decorative blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
            <div className="absolute top-[20%] left-[-8%] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* ── HEADER ── */}
            <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-50 relative">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/30">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-outfit font-bold text-xl text-slate-800 tracking-tight">
                        SMEP<span className="text-emerald-500">.</span>
                    </span>
                </div>

                {/* Auth Area */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="flex items-center gap-2">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden sm:block text-slate-700">{user.name}</span>
                            </div>
                            <div className="w-px h-5 bg-slate-200" />
                            <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition-colors p-1 group">
                                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={openLogin}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
                                Iniciar Sesión
                            </button>
                            <button onClick={openRegister}
                                className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-400/25 hover:shadow-emerald-400/40 hover:-translate-y-0.5 transition-all duration-300">
                                Registrarse
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* ── HERO ── */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-20 z-10 relative max-w-5xl mx-auto w-full">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-sm px-4 py-1.5 rounded-full mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-indigo-600 tracking-widest uppercase">Inteligencia Artificial en Tiempo Real</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-outfit tracking-tight leading-[1.1] mb-6 text-slate-900">
                    Eleva tu{' '}
                    <span className="relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Postura</span>
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 8 Q55 2 110 6 Q165 10 218 4" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="g1" x1="0" y1="0" x2="220" y2="0">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#2dd4bf" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    ,<br />
                    Maximiza tu{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">Salud</span>.
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Sistema inteligente de monitoreo ergonómico que utiliza visión artificial para analizar y corregir tu postura mientras trabajas. Previene lesiones y aumenta tu productividad.
                </p>

                {/* CTA */}
                <button onClick={handleStart}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:-translate-y-1 transition-all duration-300">
                    <MonitorPlay className="w-6 h-6" />
                    Comenzar Monitoreo
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Trust badges */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
                    {['100% Privado', 'No guarda video', 'Precisión Milimétrica'].map(t => (
                        <span key={t} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {t}
                        </span>
                    ))}
                </div>

                {/* Stats row */}
                <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                    {[
                        { value: '30 FPS', label: 'Análisis en tiempo real' },
                        { value: 'REBA', label: 'Metodología ergonómica' },
                        { value: '100%', label: 'Privado y local' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl font-black text-slate-800 font-outfit">{s.value}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </main>

            {/* ── FEATURE CARDS ── */}
            <section className="w-full max-w-5xl mx-auto px-6 pb-20 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FeatureCard
                        icon={Activity}
                        gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                        title="Análisis en Tiempo Real"
                        description="Procesamiento instantáneo a 30 FPS utilizando modelos avanzados de IA para rastrear puntos clave de tu cuerpo sin latencia."
                    />
                    <FeatureCard
                        icon={Shield}
                        gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
                        title="Prevención de Lesiones"
                        description="Identifica patrones peligrosos de inclinación del cuello y tensión en los hombros antes de que se conviertan en dolor crónico."
                    />
                    <FeatureCard
                        icon={Zap}
                        gradient="bg-gradient-to-br from-blue-500 to-cyan-400"
                        title="Feedback Inmediato"
                        description="Recibe alertas visuales y auditivas no intrusivas en el momento exacto en que tu postura sale de la zona segura."
                    />
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="w-full border-t border-slate-200/70 py-6 z-10 relative">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
                    <p>© 2026 RedUJAP · Sistema de Monitoreo Ergonómico Postural</p>
                    <p>Hecho con ❤️ para entornos laborales modernos</p>
                </div>
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => { setIsAuthModalOpen(false); onStart(); }}
                defaultIsLogin={authModalIsLogin}
            />
        </div>
    );
};

export default LandingPage;
