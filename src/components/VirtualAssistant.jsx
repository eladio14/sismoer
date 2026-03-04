import React, { useState, useEffect } from 'react';
import { Bot, MessageCircleWarning, CheckCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

const VirtualAssistant = ({ risk, angles, sessionTime }) => {
    const [message, setMessage] = useState('');
    const [mood, setMood] = useState('idle'); // idle, happy, warning, danger
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Core Logic for Assistant Feedback

        if (!risk) return;

        let newMessage = '';
        let newMood = 'happy';

        // 1. Time-based initial greeting
        if (sessionTime < 5) {
            newMessage = '¡Hola! Soy tu asistente ergonómico. Mantén una buena postura y yo me encargaré de avisarte si necesitas ajustarla.';
            newMood = 'idle';
        } else if (risk.score < 3) {
            // Excellent Posture
            const responses = [
                '¡Excelente postura! Mantenerte así previene la fatiga crónica.',
                'Tu columna te lo agradecerá. Sigue así.',
                'Perfecto. Alineación óptima de la espalda y el cuello.'
            ];
            newMessage = responses[Math.floor(Math.random() * responses.length)];
            newMood = 'happy';
        } else if (risk.score >= 3 && risk.score <= 7) {
            // Warning Posture - Analyzing specific bad angles
            newMood = 'warning';

            if (angles.neck > 20) {
                newMessage = 'Predicción: Si sigues inclinando el cuello así, es muy probable que desarrolles dolor cervical o tensión hoy mismo. ¡Levanta la barbilla!';
            } else if (angles.trunk > 20) {
                newMessage = 'Estás encorvando la espalda. Si mantienes esta postura, la zona lumbar sufrirá sobrecarga. Siéntate más atrás en la silla.';
            } else if (Math.abs(angles.shoulder_l - angles.shoulder_r) > 10) {
                newMessage = 'Tienes un hombro más alto que el otro. Apoya ambos brazos simétricamente para evitar contracturas trapeciales.';
            } else {
                newMessage = 'Tu postura está empezando a deteriorarse. Haz un pequeño reajuste para volver a la zona verde.';
            }
        } else {
            // Critical Posture
            newMood = 'danger';

            if (angles.neck > 40) {
                newMessage = '¡ALERTA CRÍTICA! Tu cuello está extremadamente flexionado. Estás agregando más de 20 kg de presión a tus vértebras cervicales. Corrige inmediatamente.';
            } else if (angles.trunk > 45) {
                newMessage = '¡ALERTA CRÍTICA! Postura muy encorvada. Riesgo inminente de hernia discal si levantas peso o mantienes esto por mucho tiempo.';
            } else {
                newMessage = '¡ALERTA CRÍTICA! Postura de alto riesgo. Por favor, levántate, estira y corrige tu posición ahora mismo.';
            }
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
        warning: { icon: MessageCircleWarning, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' },
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
