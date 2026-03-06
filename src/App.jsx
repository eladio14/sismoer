import React, { useState, useCallback, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import VideoFeed from './components/VideoFeed';
import MetricsPanel from './components/MetricsPanel';
import SettingsModal from './components/SettingsModal';
import AlertSystem from './components/AlertSystem';
import SessionStats from './components/SessionStats';
import LandingPage from './components/LandingPage';
import RebaReport from './components/RebaReport';
import VirtualAssistant from './components/VirtualAssistant';
import { calculateAngle, evaluateRiskREBA } from './utils/ergonomics';
// CSS imports removed in favor of Tailwind

const DEFAULT_SETTINGS = {
    audioEnabled: false,
    privacyMode: false,
    breakInterval: 30,
    deadzone: 5,
    workProfile: 'oficina'
};

const SMOOTHING_ALPHA = 0.35;

function App() {
    const [isStarted, setIsStarted] = useState(false);

    const [angles, setAngles] = useState({
        neck: 0,
        trunk: 0,
        shoulder_l: 0,
        shoulder_r: 0,
        shoulder_height_l: 0,
        shoulder_height_r: 0,
        shoulder_tilt: 0,
        elbow_l: 0, elbow_r: 0,
        wrist_l: 0, wrist_r: 0,
        hip_l: 0, hip_r: 0,
        knee_l: 0, knee_r: 0,
        ankle_l: 0, ankle_r: 0
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
    const [riskHistory, setRiskHistory] = useState([]);
    const [reportImage, setReportImage] = useState('');
    const [snapshotRequestId, setSnapshotRequestId] = useState(0);
    const [isPrintPending, setIsPrintPending] = useState(false);
    const [segmentStatus, setSegmentStatus] = useState({
        cervical: { status: 'ok', value: 0 },
        tronco: { status: 'ok', value: 0 },
        hombros: { status: 'ok', value: 0 },
        codos: { status: 'ok', value: 0 },
        munecas: { status: 'ok', value: 0 }
    });

    // Settings & Calibration State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [calibration, setCalibration] = useState({
        trunk: 0,
        neck: 0
    });

    const smoothedAnglesRef = useRef(null);
    const lastSampleRef = useRef(0);

    const handlePrintReport = useCallback(() => {
        // Force a fresh snapshot right before printing.
        setIsPrintPending(true);
        setSnapshotRequestId(prev => prev + 1);

        // Fallback in case snapshot does not refresh in time.
        setTimeout(() => {
            setIsPrintPending(prev => {
                if (prev) {
                    window.print();
                    return false;
                }
                return prev;
            });
        }, 1200);
    }, []);

    useEffect(() => {
        if (!isPrintPending) return;
        if (!reportImage) return;

        const timer = setTimeout(() => {
            window.print();
            setIsPrintPending(false);
        }, 220);

        return () => clearTimeout(timer);
    }, [isPrintPending, reportImage]);

    useEffect(() => {
        try {
            const persisted = localStorage.getItem('smep.settings');
            if (persisted) {
                const parsed = JSON.parse(persisted);
                setSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch (e) {
            console.error('No se pudieron cargar los ajustes guardados', e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('smep.settings', JSON.stringify(settings));
        } catch (e) {
            console.error('No se pudieron guardar los ajustes', e);
        }
    }, [settings]);

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
        if (!results.poseLandmarks) return;

        // Start monitoring once we get first valid landmarks
        setIsMonitoring(true);

        const lm = results.poseLandmarks;

        // Points indices (MediaPipe Pose): 
        // 11: L shoulder, 12: R shoulder
        // 23: L hip, 24: R hip
        // 7: L ear, 8: R ear

        // Helper to get point
        const p = (idx) => lm[idx];

        // 1. Neck Angle (Mid Shoulder to Mid Ear) vs vertical
        const midShoulder = { x: (p(11).x + p(12).x) / 2, y: (p(11).y + p(12).y) / 2 };
        const midEar = { x: (p(7).x + p(8).x) / 2, y: (p(7).y + p(8).y) / 2 };

        const vertRef = { x: midShoulder.x, y: midShoulder.y - 0.5 }; // Upwards
        const neckAngle = calculateAngle(midEar, midShoulder, vertRef);

        // 2. Trunk Angle (Mid Hip to Mid Shoulder) vs Vertical
        const midHip = { x: (p(23).x + p(24).x) / 2, y: (p(23).y + p(24).y) / 2 };
        const trunkAngle = calculateAngle(midShoulder, midHip, { x: midHip.x, y: midHip.y - 0.5 });
        // Note: calculateAngle geometry depends on order. 
        // If standing straight, midShoulder is directly above midHip.

        // 3. Shoulder and arm metrics
        const shoulder_l = calculateAngle(p(23), p(11), p(13));
        const shoulder_r = calculateAngle(p(24), p(12), p(14));
        const shoulder_tilt = Math.abs((Math.atan2(p(12).y - p(11).y, p(12).x - p(11).x) * 180) / Math.PI);

        // 4. Extremities (Arms, Wrists, Legs, Knees, Ankles)
        const elbow_l = calculateAngle(p(11), p(13), p(15));
        const elbow_r = calculateAngle(p(12), p(14), p(16));

        const wrist_l = calculateAngle(p(13), p(15), p(19));
        const wrist_r = calculateAngle(p(14), p(16), p(20));

        const hip_l = calculateAngle(p(11), p(23), p(25));
        const hip_r = calculateAngle(p(12), p(24), p(26));

        const knee_l = calculateAngle(p(23), p(25), p(27));
        const knee_r = calculateAngle(p(24), p(26), p(28));

        const ankle_l = calculateAngle(p(25), p(27), p(31));
        const ankle_r = calculateAngle(p(26), p(28), p(32));

        const rawAngles = {
            neck: neckAngle,
            trunk: trunkAngle,
            shoulder_l,
            shoulder_r,
            shoulder_height_l: p(11).y * 100,
            shoulder_height_r: p(12).y * 100,
            shoulder_tilt,
            elbow_l, elbow_r,
            wrist_l, wrist_r,
            hip_l, hip_r,
            knee_l, knee_r,
            ankle_l, ankle_r
        };

        const previous = smoothedAnglesRef.current;
        const smoothedAngles = previous
            ? Object.keys(rawAngles).reduce((acc, key) => {
                acc[key] = previous[key] + (rawAngles[key] - previous[key]) * SMOOTHING_ALPHA;
                return acc;
            }, {})
            : rawAngles;

        smoothedAnglesRef.current = smoothedAngles;
        setAngles(smoothedAngles);

        // Evaluate Risk using the new logic
        const riskEval = evaluateRiskREBA(smoothedAngles, calibration, { deadzone: settings.deadzone || 0 });

        setRisk(riskEval);

        const shoulderDiff = Math.abs((smoothedAngles.shoulder_height_l || 0) - (smoothedAngles.shoulder_height_r || 0));
        const elbowDeviation = Math.max(
            Math.abs(90 - (smoothedAngles.elbow_l || 90)),
            Math.abs(90 - (smoothedAngles.elbow_r || 90))
        );
        const wristDeviation = Math.max(
            Math.abs(180 - (smoothedAngles.wrist_l || 180)),
            Math.abs(180 - (smoothedAngles.wrist_r || 180))
        );

        const statusByThreshold = (value, low, medium) => {
            if (value <= low) return 'ok';
            if (value <= medium) return 'warn';
            return 'risk';
        };

        setSegmentStatus({
            cervical: { status: statusByThreshold(riskEval.subScores.adjustedNeck || 0, 10, 20), value: riskEval.subScores.adjustedNeck || 0 },
            tronco: { status: statusByThreshold(riskEval.subScores.adjustedTrunk || 0, 10, 20), value: riskEval.subScores.adjustedTrunk || 0 },
            hombros: { status: statusByThreshold(shoulderDiff, 2, 4), value: shoulderDiff },
            codos: { status: statusByThreshold(elbowDeviation, 20, 35), value: elbowDeviation },
            munecas: { status: statusByThreshold(wristDeviation, 15, 30), value: wristDeviation }
        });

    }, [calibration, settings.deadzone]);

    useEffect(() => {
        if (!isMonitoring || risk.score <= 0) return;
        if (sessionTime === 0 || sessionTime % 10 !== 0 || lastSampleRef.current === sessionTime) return;

        lastSampleRef.current = sessionTime;
        setRiskHistory(prev => {
            const next = [...prev, { second: sessionTime, score: risk.score, level: risk.level }];
            return next.slice(-36); // Last 6 minutes sampled every 10s
        });
    }, [isMonitoring, risk.score, risk.level, sessionTime]);

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-auto lg:h-[600px] xl:h-[calc(100vh-14rem)] pb-4 lg:pb-0">
                {/* Video Feed Area - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2 w-full aspect-[4/3] sm:aspect-video lg:aspect-auto min-h-[300px] lg:min-h-0 lg:h-full">
                    <VideoFeed
                        onResults={handlePoseResults}
                        onSnapshot={setReportImage}
                        snapshotRequestId={snapshotRequestId}
                        riskLevel={risk.level}
                        privacyMode={settings.privacyMode}
                    />
                </div>

                {/* Metrics Panel - Takes up 1 column */}
                <div className="lg:col-span-1 h-auto lg:h-full">
                    <MetricsPanel
                        angles={angles}
                        risk={risk}
                        riskHistory={riskHistory}
                        segmentStatus={segmentStatus}
                        onPrint={handlePrintReport}
                    />
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
            <VirtualAssistant risk={risk} angles={angles} sessionTime={sessionTime} />
            <RebaReport
                angles={angles}
                risk={risk}
                settings={settings}
                riskHistory={riskHistory}
                segmentStatus={segmentStatus}
                reportImage={reportImage}
            />
        </Dashboard>
    );
}

export default App;
