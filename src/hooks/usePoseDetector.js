import { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export const usePoseDetector = (videoRef, canvasRef) => {
    const [results, setResults] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const poseRef = useRef(null);
    const cameraRef = useRef(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;

        if (!videoElement || !canvasElement) return;

        const initMediaPipe = async () => {
            console.log("Iniciando Pose Detector...");
            setError(null);
            setIsLoaded(false);

            try {
                // 1. Check Camera Permission and Availability
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Su navegador web no soporta acceso a la cámara o no está en un entorno seguro (HTTPS).");
                }

                let stream = null;
                try {
                    // Try 720p first
                    stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
                } catch (err) {
                    console.warn("Fallo resolución 720p, intentando resolución por defecto:", err);
                    try {
                        // Fallback to default
                        stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    } catch (fallbackErr) {
                        throw new Error("Permiso de cámara denegado o dispositivo en uso por otra aplicación.");
                    }
                }

                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                if (!isMounted.current) return;

                // 2. Initialize Pose
                const pose = new Pose({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                    },
                });

                pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6,
                });

                pose.onResults((res) => {
                    if (isMounted.current) {
                        setResults(res);
                    }
                });

                poseRef.current = pose;

                // 3. Initialize Camera
                // MediaPipe Camera Utils uses a loop internally.
                const camera = new Camera(videoElement, {
                    onFrame: async () => {
                        if (poseRef.current && isMounted.current) {
                            await poseRef.current.send({ image: videoElement });
                        }
                    },
                    width: 1280,
                    height: 720,
                });

                cameraRef.current = camera;

                await camera.start();

                if (isMounted.current) {
                    setIsLoaded(true);
                    console.log("Cámara iniciada correctamente.");
                }

            } catch (err) {
                console.error("Error inicializando:", err);
                if (isMounted.current) {
                    setError(err.message || "Error desconocido al iniciar la cámara.");
                    setIsLoaded(false);
                }
            }
        };

        initMediaPipe();

        return () => {
            console.log("Limpiando recursos...");
            isMounted.current = false;

            if (cameraRef.current) {
                // Attempt to stop camera if the library exposes a stop method (it usually does but sometimes async)
                // The MediaPipe camera util 'stop' might not be fully instant.
                try {
                    // There isn't a documented clean .stop() that destroys everything in v0.3 sometimes, 
                    // but we try.
                    cameraRef.current.stop();
                } catch (e) { console.error("Error stopping camera", e); }
                cameraRef.current = null;
            }

            if (poseRef.current) {
                try {
                    poseRef.current.close();
                } catch (e) { console.error("Error closing pose", e); }
                poseRef.current = null;
            }
        };
    }, [videoRef, canvasRef]);

    return { results, isLoaded, error };
};
