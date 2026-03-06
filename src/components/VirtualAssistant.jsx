import React, { useState, useEffect } from 'react';
import { Bot, AlertCircle, CheckCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

const VirtualAssistant = ({ risk, angles, sessionTime }) => {
    const [message, setMessage] = useState('');
    const [mood, setMood] = useState('idle'); // idle, happy, warning, danger
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!risk) return;

        let newMessage = '';
        let newMood = 'happy';

        const topRecommendation = risk.recommendations?.[0];

        if (sessionTime < 5) {
            newMessage = 'Bienvenido. Mantén espalda apoyada, codos cerca de 90° y mirada al frente para iniciar en zona segura.';
            newMood = 'idle';
        } else if (risk.score <= 3) {
            const responses = [
                'Excelente alineación. Mantén esta postura para reducir fatiga acumulada.',
                'Buen control postural. Continúa con micro-pausas cada 30-45 minutos.',
                'Postura estable. Evita adelantar cabeza y hombros para sostener este nivel.'
            ];
            const index = Math.floor(sessionTime / 10) % responses.length;
            newMessage = responses[index];
            newMood = 'happy';
        } else if (risk.score >= 3 && risk.score <= 7) {
            newMood = 'warning';
            newMessage = topRecommendation || 'Se detecta desviación moderada. Realiza un ajuste suave para volver a zona verde.';
        } else {
            newMood = 'danger';
            newMessage = topRecommendation || 'Riesgo alto sostenido. Corrige postura ahora y toma una pausa activa breve.';
        }

        setMessage(newMessage);
        setMood(newMood);

        // Auto-show if risk is high, even if user dismissed it
        if (risk.score >= 8 && !isVisible) {
            setIsVisible(true);
        }

    }, [risk, angles, sessionTime]);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-6 right-6 p-4 bg-slate-800/90 hover:bg-slate-700/90 text-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md transition-all z-50 group hover:scale-110"
            >
                <Bot size={24} className="text-blue-400 group-hover:animate-pulse" />
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500"></span>
            </button>
        );
    }

    const moodConfig = {
        idle: { icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
        happy: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' },
        warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' },
        danger: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse' }
    };

    const currentMood = moodConfig[mood];
    const Icon = currentMood.icon;

    return (
        <div className={`fixed bottom-6 right-6 w-[85vw] max-w-[340px] z-50 p-4 rounded-2xl sm:rounded-3xl backdrop-blur-xl border ${currentMood.border} bg-slate-900/80 ${currentMood.glow} transition-all duration-500 ease-out transform translate-y-0 opacity-100 flex flex-col gap-3 shadow-2xl`}>

            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${currentMood.bg}`}>
                        <Bot size={18} className={currentMood.color} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">SMEP AI Coach</span>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/10 rounded-md text-slate-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="flex gap-3 items-start p-2">
                <div className="flex-shrink-0 mt-1">
                    <Icon size={20} className={currentMood.color} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200 leading-relaxed font-inter">
                        {message}
                    </p>
                </div>
            </div>

            {/* Decorative tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900/80 border-b border-r border-white/10 transform rotate-45 backdrop-blur-xl"></div>
        </div>
    );
};

export default VirtualAssistant;
