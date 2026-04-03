import React, { useRef, useEffect } from 'react';
import { usePoseDetector } from '../hooks/usePoseDetector';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';

const VideoFeed = ({ onResults, onSnapshot, snapshotRequestId, riskLevel, privacyMode }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const lastSnapshotAt = useRef(0);
    const { results, isLoaded, error } = usePoseDetector(videoRef, canvasRef);

    const captureSnapshot = () => {
        if (!onSnapshot || !videoRef.current || videoRef.current.readyState < 2) return;

        const snapshotCanvas = document.createElement('canvas');
        const vw = videoRef.current.videoWidth || 1280;
        const vh = videoRef.current.videoHeight || 720;
        snapshotCanvas.width = vw;
        snapshotCanvas.height = vh;
        const sctx = snapshotCanvas.getContext('2d');
        if (!sctx) return;

        // Compose final snapshot as seen by user: video + skeleton overlay, mirrored.
        sctx.translate(vw, 0);
        sctx.scale(-1, 1);
        sctx.drawImage(videoRef.current, 0, 0, vw, vh);
        if (canvasRef.current) {
            sctx.drawImage(canvasRef.current, 0, 0, vw, vh);
        }
        onSnapshot(snapshotCanvas.toDataURL('image/jpeg', 0.85));
    };

    useEffect(() => {
        if (!snapshotRequestId) return;
        try {
            captureSnapshot();
        } catch (e) {
            console.error('No se pudo generar snapshot bajo demanda', e);
        }
    }, [snapshotRequestId]);

    // Dynamic skeleton color based on risk
    const skeletonColor = riskLevel === 'Alto' ? '#ef4444' : riskLevel === 'Medio' ? '#f59e0b' : '#10b981';

    useEffect(() => {
        if (results && canvasRef.current) {
            onResults(results);

            // Draw Skeleton
            const ctx = canvasRef.current.getContext('2d');
            const { image, poseLandmarks } = results;

            ctx.save();
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Draw Landmarks on transparent canvas (video is playing behind it)

            // Draw Landmarks
            if (poseLandmarks) {
                // We need to access the global drawUtils if loaded via CDN in index.html, 
                // BUT we are in a module system. We installed @mediapipe/drawing_utils.
                // Since this might not be fully configured, let's use the window globals if available
                // or try to import. To imply robustness without complex bundler setup for mediapipe's weird exports:
                // We can use a simple manual drawing or try accessing window methods if the hook loaded them.
                // The hook loaded the core library. Drawing utils usually must be imported.
                // Let's rely on the fact we installed the package and imported the utils? 
                // Actually MediaPipe packages are tricky with ES modules.
                // Let's use a robust fallback: basic canvas drawing if utils aren't available, 
                // but preferably use the window.drawConnectors if available (from CDN).
                // Re-checking hook: it uses CDN for pose.

                // Let's just manually draw lines for the critical parts to be safe and performant.
                // Neck, Trunk, Shoulders.

                // Basic helper to draw line
                const drawLine = (start, end) => {
                    if (!start || !end) return;
                    ctx.beginPath();
                    ctx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
                    ctx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
                    ctx.strokeStyle = skeletonColor;
                    ctx.lineWidth = 6;
                    ctx.lineCap = 'round';
                    // Glow effect
                    ctx.shadowColor = skeletonColor;
                    ctx.shadowBlur = 15;
                    ctx.stroke();
                    // Reset shadow
                    ctx.shadowBlur = 0;
                };

                const drawPoint = (point) => {
                    if (!point) return;
                    // Outer glow/ring
                    ctx.beginPath();
                    ctx.arc(point.x * canvasRef.current.width, point.y * canvasRef.current.height, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = skeletonColor;
                    ctx.shadowBlur = 12;
                    ctx.fill();

                    // Inner colored dot
                    ctx.beginPath();
                    ctx.arc(point.x * canvasRef.current.width, point.y * canvasRef.current.height, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = skeletonColor;
                    ctx.shadowBlur = 0;
                    ctx.fill();
                };

                const lm = poseLandmarks;

                // Draw Shoulders
                drawLine(lm[11], lm[12]);
                // Draw Trunk (Shoulders to Hips)
                drawLine(lm[11], lm[23]);
                drawLine(lm[12], lm[24]);
                drawLine(lm[23], lm[24]);
                // Draw Neck (mid shoulder to nose)
                drawLine({ x: (lm[11].x + lm[12].x) / 2, y: (lm[11].y + lm[12].y) / 2 }, lm[0]);
                // Draw Arms
                drawLine(lm[11], lm[13]); // L shoulder to elbow
                drawLine(lm[13], lm[15]); // L elbow to wrist
                drawLine(lm[12], lm[14]); // R shoulder to elbow
                drawLine(lm[14], lm[16]); // R elbow to wrist
                // Draw Legs
                drawLine(lm[23], lm[25]); // L hip to knee
                drawLine(lm[25], lm[27]); // L knee to ankle
                drawLine(lm[24], lm[26]); // R hip to knee
                drawLine(lm[26], lm[28]); // R knee to ankle

                // Draw Points
                const pointsToDraw = [
                    0, // nose
                    7, 8, // ears
                    11, 12, // shoulders
                    13, 14, // elbows
                    15, 16, // wrists
                    23, 24, // hips
                    25, 26, // knees
                    27, 28 // ankles
                ];
                pointsToDraw.forEach(idx => drawPoint(lm[idx]));

                if (onSnapshot && videoRef.current && videoRef.current.readyState >= 2) {
                    const now = Date.now();
                    if (now - lastSnapshotAt.current > 1500) {
                        try {
                            captureSnapshot();
                            lastSnapshotAt.current = now;
                        } catch (e) {
                            console.error('No se pudo generar snapshot para el reporte', e);
                        }
                    }
                }
            }

            ctx.restore();
        }
    }, [results, onResults, onSnapshot, skeletonColor]);

    return (
        <div className="relative w-full h-full group">
            {/* Video and Canvas Layer */}
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-all duration-700 ${privacyMode ? 'filter blur-2xl brightness-50' : ''}`}
                    playsInline
                    autoPlay
                    muted
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10" // Removed mix-blend-screen
                    width="1280"
                    height="720"
                />
            </div>

            {/* Loading State */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-md z-10 transition-opacity duration-500">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <p className="text-blue-400 font-bold uppercase tracking-[0.2em] animate-pulse">Iniciando Motor de IA</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950/90 backdrop-blur-md z-20 p-8 text-center">
                    <div className="p-4 bg-rose-500/20 rounded-full mb-6 animate-pulse">
                        <AlertCircle size={48} className="text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
                    </div>
                    <p className="text-white text-xl font-black uppercase tracking-wider mb-2">Error de Sistema</p>
                    <p className="text-rose-200/80 mb-8 max-w-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-3 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all font-bold tracking-wide"
                    >
                        <RefreshCw size={20} />
                        REINICIAR MÓDULO
                    </button>
                </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                        <Camera size={16} className="text-blue-400 animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.2em] text-blue-100 uppercase">System Vision</span>
                    </div>

                    {isLoaded && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-xl border border-emerald-500/20 shadow-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                            <span className="text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase">Tracking</span>
                        </div>
                    )}
                </div>

                {/* Bottom Stats */}
                <div className="flex justify-between items-end">
                    <div className="px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                        <span className="text-[9px] text-blue-300/70 font-bold uppercase tracking-[0.3em] block mb-0.5">AI Engine</span>
                        <span className="text-xs font-black tracking-wider text-white">BlazePose 3D</span>
                    </div>
                    <div className="w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Crosshairs */}
                <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </div>
    );
};

export default VideoFeed;
