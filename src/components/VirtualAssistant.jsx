import React, { useState, useEffect } from 'react';
import { Bot, AlertCircle, CheckCircle, AlertTriangle, Sparkles, X, BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const VirtualAssistant = ({ risk, angles, sessionTime, settings }) => {
    const [message, setMessage] = useState('');
    const [mood, setMood] = useState('idle'); // idle, happy, warning, danger
    const [isVisible, setIsVisible] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const [lastAiTime, setLastAiTime] = useState(0);

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

        // Only update with static messages if not currently showing an AI thought or recently updated by AI
        if (!isThinking && (sessionTime - lastAiTime > 15 || lastAiTime === 0)) {
            // Auto-show if risk is high, even if user dismissed it
            if (risk.score >= 8 && !isVisible) {
                setIsVisible(true);
            }
        }

    }, [risk, angles, sessionTime, isThinking, lastAiTime, isVisible]);

    const fetchAIAdvice = async () => {
        if (!settings?.geminiApiKey) return;
        setIsThinking(true);
        setIsVisible(true); // Ensure it's open
        try {
            const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey });
            const prompt = `Eres un coach ergonómico (SMEP AI Coach). El trabajador lleva ${sessionTime} segundos trabajando. Su riesgo REBA actual es ${risk.score}/15 (${risk.level}). Ángulo de cuello: ${angles?.neck?.toFixed(1) || 0}°, tronco: ${angles?.trunk?.toFixed(1) || 0}°. Brevemente (1 a 2 oraciones, máximo 20 palabras), dale un consejo o ánimo amigable y profesional. No saludes.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setMessage(response.text);
            setMood(risk.score <= 3 ? 'happy' : risk.score <= 7 ? 'warning' : 'danger');
            setLastAiTime(sessionTime);
        } catch (error) {
            console.error("AI Error:", error);
            setMessage('No pude conectar con Gemini. Verifica tu API Key.');
            setMood('warning');
        } finally {
            setIsThinking(false);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-6 right-6 p-4 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-2xl border border-slate-200 backdrop-blur-md transition-all z-50 group hover:scale-110"
            >
                <Bot size={24} className="text-blue-500 group-hover:animate-pulse" />
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500"></span>
            </button>
        );
    }

    const moodConfig = {
        idle: { icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
        happy: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
        warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
        danger: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-pulse' }
    };

    const currentMood = moodConfig[mood];
    const Icon = currentMood.icon;

    return (
        <div className={`fixed bottom-6 right-6 w-[85vw] max-w-[340px] z-50 p-4 rounded-2xl sm:rounded-3xl backdrop-blur-xl border ${currentMood.border} bg-white/95 ${currentMood.glow} transition-all duration-500 ease-out transform translate-y-0 opacity-100 flex flex-col gap-3 shadow-2xl`}>

            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${currentMood.bg}`}>
                        <Bot size={18} className={currentMood.color} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SMEP AI Coach</span>
                    {settings?.geminiApiKey && (
                        <button 
                            onClick={fetchAIAdvice} 
                            disabled={isThinking}
                            className="ml-2 flex flex-row items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-200 disabled:opacity-50"
                        >
                            {isThinking ? <Loader2 size={10} className="animate-spin" /> : <BrainCircuit size={10} />}
                            IA
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
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
                    <p className="text-sm font-medium text-slate-700 leading-relaxed font-inter">
                        {message}
                    </p>
                </div>
            </div>

            {/* Decorative tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/95 border-b border-r border-slate-200 transform rotate-45 backdrop-blur-xl"></div>
        </div>
    );
};

export default VirtualAssistant;
