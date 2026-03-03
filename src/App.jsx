import React, { useState, useCallback, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import VideoFeed from './components/VideoFeed';
import MetricsPanel from './components/MetricsPanel';
import SettingsModal from './components/SettingsModal';
import AlertSystem from './components/AlertSystem';
import SessionStats from './components/SessionStats';
import LandingPage from './components/LandingPage';
import { calculateAngle, evaluateRisk } from './utils/ergonomics';
// CSS imports removed in favor of Tailwind

function App() {
    const [isStarted, setIsStarted] = useState(false);

    const [angles, setAngles] = useState({
        neck: 0,
        trunk: 0,
        shoulder_l: 0,
        shoulder_r: 0
    });

    // Risk State
    const [risk, setRisk] = useState({
        score: 0,
        level: 'Bajo',
        color: 'text-emerald-400',
        statusColor: 'bg-emerald-500'
    });

    // Session Stats
    const [sessionTime, setSessionTime] = useState(0);
    const [goodPostureTime, setGoodPostureTime] = useState(0);
    const [badPostureTime, setBadPostureTime] = useState(0);
    const [isMonitoring, setIsMonitoring] = useState(false);

    // Settings & Calibration State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({
        audioEnabled: false,
        privacyMode: false,
        breakInterval: 30, // in minutes
        deadzone: 5 // Sensitivity
    });
    const [calibration, setCalibration] = useState({
        trunk: 0,
        neck: 0
    });

    const handleCalibrate = useCallback(() => {
        // Use current angles as the new "zero"
        setCalibration({
            trunk: angles.trunk || 0,
            neck: angles.neck || 0
        });
    }, [angles]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isMonitoring) {
            interval = setInterval(() => {
                setSessionTime(prev => prev + 1);

                if (risk.level === 'Bajo') {
                    setGoodPostureTime(prev => prev + 1);
                } else {
                    setBadPostureTime(prev => prev + 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isMonitoring, risk.level]);

    const handlePoseResults = useCallback((results) => {
        // Start monitoring once we get first results
        setIsMonitoring(true);

        if (!results.poseLandmarks) return;

        const lm = results.poseLandmarks;

        // Points indices (MediaPipe Pose): 
        // 11: L shoulder, 12: R shoulder
        // 23: L hip, 24: R hip
        // 7: L ear, 8: R ear

        // Helper to get point
        const p = (idx) => lm[idx];

        // 1. Neck Angle (Mid Shoulder to Mid Ear) vs Vertical/Spine
        const midShoulder = { x: (p(11).x + p(12).x) / 2, y: (p(11).y + p(12).y) / 2 };
        const midEar = { x: (p(7).x + p(8).x) / 2, y: (p(7).y + p(8).y) / 2 };

        // Relative to vertical (assuming camera is level)
        // Or relative to trunk for more biomechanical accuracy. 
        // Using vertical for simplicity in this version.
        const vertRef = { x: midShoulder.x, y: midShoulder.y - 0.5 }; // Upwards
        const neckAngle = calculateAngle(midEar, midShoulder, vertRef);

        // 2. Trunk Angle (Mid Hip to Mid Shoulder) vs Vertical
        const midHip = { x: (p(23).x + p(24).x) / 2, y: (p(23).y + p(24).y) / 2 };
        const trunkAngle = calculateAngle(midShoulder, midHip, { x: midHip.x, y: midHip.y - 0.5 });
        // Note: calculateAngle geometry depends on order. 
        // If standing straight, midShoulder is directly above midHip.

        // 3. Shoulder Symmetry (Tilting)
        // Angle of line 11-12 vs Horizontal
        const shoulderSlope = Math.abs(p(11).y - p(12).y) * 100; // Rough approximation of slope/tilt
        // Or calculate angle:
        const shoulderAngleL = calculateAngle(p(11), midShoulder, { x: midShoulder.x - 0.5, y: midShoulder.y });
        // Let's stick to the previous simple logic but normalized

        // New proper angles object
        const newAngles = {
            neck: neckAngle,
            trunk: trunkAngle,
            shoulder_l: shoulderAngleL, // Keeping raw for debug if needed
            shoulder_r: 0,
            // Refined symmetry for UI
            shoulder_level_diff: (p(11).y - p(12).y) * 100 // + means right higher? y increases downwards
        };

        // Re-map for compatibility with existing UI props
        // We update the state with "display friendly" values
        setAngles({
            neck: neckAngle,
            trunk: trunkAngle,
            shoulder_l: (p(11).y * 100), // Raw Y for simple visualization of height
            shoulder_r: (p(12).y * 100)
        });

        // Evaluate Risk using the new logic
        const riskEval = evaluateRisk({
            neck: neckAngle,
            trunk: trunkAngle,
            shoulder_l: p(11).y * 100,
            shoulder_r: p(12).y * 100
        }, calibration);

        setRisk(riskEval);

    }, [calibration]);

    if (!isStarted) {
        return <LandingPage onStart={() => setIsStarted(true)} />;
    }

    return (
        <Dashboard onOpenSettings={() => setIsSettingsOpen(true)}>

            <SessionStats
                totalTime={sessionTime}
                goodTime={goodPostureTime}
                badTime={badPostureTime}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px] xl:h-[calc(100vh-14rem)] pb-8 lg:pb-0">
                {/* Video Feed Area - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2 min-h-[400px] lg:h-full">
                    <VideoFeed onResults={handlePoseResults} riskLevel={risk.level} privacyMode={settings.privacyMode} />
                </div>

                {/* Metrics Panel - Takes up 1 column */}
                <div className="lg:col-span-1 h-auto lg:h-full">
                    <MetricsPanel angles={angles} risk={risk} />
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onUpdateSettings={setSettings}
                onCalibrate={handleCalibrate}
            />

            <AlertSystem risk={risk} settings={settings} sessionTime={sessionTime} />
        </Dashboard>
    );
}

export default App;
