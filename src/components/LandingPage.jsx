import React, { useState } from 'react';
import { Activity, Shield, Zap, ChevronRight, MonitorPlay, CheckCircle2, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-5 sm:p-6 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 group">
        <div className="bg-emerald-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2 font-outfit">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

const LandingPage = ({ onStart }) => {
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalIsLogin, setAuthModalIsLogin] = useState(true);

    const openLogin = () => {
        setAuthModalIsLogin(true);
        setIsAuthModalOpen(true);
    };

    const openRegister = () => {
        setAuthModalIsLogin(false);
        setIsAuthModalOpen(true);
    };

    // Require Auth to Start (Optional, but good for tracking history)
    const handleStart = () => {
        if (!user) {
            openLogin();
        } else {
            onStart();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 font-inter overflow-x-hidden relative flex flex-col items-center justify-center pt-8 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8">

            {/* Header / Auth Bar */}
            <header className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-50 max-w-7xl mx-auto w-full">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <span className="font-outfit font-bold text-xl tracking-wide hidden sm:block text-white">
                        SMEP<span className="text-emerald-500">.</span>
                    </span>
                </div>
                
                {/* Auth Area */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-700"></div>
                            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm group">
                                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                <span className="hidden sm:block">Salir</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openLogin}
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors px-3 py-2"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={openRegister}
                                className="text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 transition-all px-4 py-2 rounded-lg"
                            >
                                Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <div className="max-w-5xl w-full z-10 flex flex-col items-center">
                {/* Header Section */}
                <div className="text-center max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">Inteligencia Artificial en Tiempo Real</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 font-outfit tracking-tight leading-tight">
                        Eleva tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Postura</span>,<br />
                        Maximiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Salud</span>.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Sistema inteligente de monitoreo ergonómico que utiliza visión artificial para analizar y corregir tu postura mientras trabajas. Previene lesiones y aumenta tu productividad.
                    </p>

                    <button
                        onClick={handleStart}
                        className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1"
                    >
                        <MonitorPlay className="w-5 h-5" />
                        <span className="text-base sm:text-lg">Comenzar Monitoreo</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> 100% Privado</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> No guarda video</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> Precisión Milimétrica</span>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
                    <FeatureCard
                        icon={Activity}
                        title="Análisis en Tiempo Real"
                        description="Procesamiento instantáneo a 30 FPS utilizando modelos avanzados de IA para rastrear puntos clave de tu cuerpo sin latencia."
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Prevención de Lesiones"
                        description="Identifica patrones peligrosos de inclinación del cuello y tensión en los hombros antes de que se conviertan en dolor crónico."
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Feedback Inmediato"
                        description="Recibe alertas visuales y auditivas no intrusivas en el momento exacto en que tu postura sale de la zona segura."
                    />
                </div>

                {/* Footer/Extra Info */}
                <div className="mt-20 text-center border-t border-slate-800/50 pt-8 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                    <p>© 2026 RedUJAP - Sistema de Monitoreo Ergonómico Postural (SMEP)</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span className="hover:text-slate-300 cursor-pointer transition-colors">Optimizado para entornos laborales modernos</span>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    onStart();
                }}
                defaultIsLogin={authModalIsLogin}
            />
        </div>
    );
};

export default LandingPage;
