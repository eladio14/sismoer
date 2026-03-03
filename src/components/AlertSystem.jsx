import { useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';

/**
 * Handles audio alerts, toast notifications based on risk state, and micro-break reminders.
 */
const AlertSystem = ({ risk, settings, sessionTime }) => {
    const audioRef = useRef(null);
    const lastAlertTime = useRef(0);

    useEffect(() => {
        // Create audio element once
        audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'); // Subtle beep
        audioRef.current.volume = 0.5;
    }, []);

    useEffect(() => {
        if (!risk || !settings.audioEnabled || risk.score < 6) return;

        const now = Date.now();
        // Prevent spamming alerts (max once every 3 seconds)
        if (now - lastAlertTime.current > 3000) {

            // Play sound
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            }

            // Show Toast
            const mainIssue = risk.issues?.length > 0 ? risk.issues[0] : 'Por favor, ajusta tu posición.';
            if (risk.score >= 8) {
                toast.error(`¡Postura Crítica! ${mainIssue}`, {
                    duration: 4000,
                });
            } else {
                toast.warning(`Atención: ${mainIssue}`, {
                    duration: 3000,
                });
            }

            lastAlertTime.current = now;
        }
    }, [risk, settings]);

    // Active break timer (Pomodoro-style)
    useEffect(() => {
        if (!settings.breakInterval || sessionTime === 0) return;

        // Convert breakInterval (minutes) to seconds
        const breakIntervalSeconds = settings.breakInterval * 60;

        if (sessionTime % breakIntervalSeconds === 0) {
            toast.info('⏱️ ¡Pausa Activa! Es momento de levantarte, estirar las piernas y descansar la vista.', {
                duration: 8000,
                position: 'top-center',
                style: {
                    background: 'rgba(59, 130, 246, 0.9)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                }
            });
            if (settings.audioEnabled && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            }
        }
    }, [sessionTime, settings.breakInterval, settings.audioEnabled]);

    return (
        <Toaster
            position="top-right"
            theme="dark"
            richColors
            closeButton
        />
    );
};

export default AlertSystem;
