/**
 * Calculate angle between three points (A, B, C) where B is the vertex
 * Points: {x, y, z, visibility}
 */
export const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return 0;

    // Using atan2 for 2D angle projection
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) angle = 360 - angle;
    return angle;
};

/**
 * Determine Risk Level based on REBA-inspired logic for standing work.
 * Now supports calibrated offsets.
 * 
 * @param {Object} angles { neck, trunk, shoulder_l, shoulder_r }
 * @param {Object} calibration { neck: 0, trunk: 0, ... } (Optional offsets)
 */
export const evaluateRisk = (angles, calibration = {}) => {
    let score = 0;
    let issues = [];

    // Normalize angles with calibration if provided
    const trunkVal = Math.abs(angles.trunk - (calibration.trunk || 0));
    const neckVal = Math.abs(angles.neck - (calibration.neck || 0));

    // Trunk Analysis (REBA-like)
    // 0-5 deg: Score 1 (Low)
    // 5-20 deg: Score 2 (Medium)
    // 20-60 deg: Score 3 (High)
    // >60 deg: Score 4 (Very High)
    if (trunkVal < 5) {
        score += 1;
    } else if (trunkVal < 20) {
        score += 2;
        issues.push("Ligera inclinación del tronco");
    } else if (trunkVal < 60) {
        score += 3;
        issues.push("Tronco muy encorvado");
    } else {
        score += 4; // Critical
        issues.push("Postura de tronco crítica");
    }

    // Neck Analysis
    // 0-10 deg: Score 1
    // 10-20 deg: Score 2
    // >20 deg: Score 3
    if (neckVal < 10) {
        score += 1;
    } else if (neckVal < 20) {
        score += 2;
        issues.push("Cuello algo inclinado");
    } else {
        score += 3;
        issues.push("Cuello excesivamente inclinado");
    }

    // Bilateral Symmetry (Shoulder level)
    // High difference implies leaning or imbalances
    const symmetryDiff = Math.abs(angles.shoulder_l - angles.shoulder_r);
    if (symmetryDiff > 20) {
        score += 2;
        issues.push("Fuerte desbalance de hombros");
    } else if (symmetryDiff > 10) {
        score += 1;
        issues.push("Hombros desalineados");
    }

    // Normalize final score to 1-10 scale approximation for UI
    // Min theoretical: 1+1 = 2
    // Max theoretical: 4+3+2 = 9

    let level = 'Bajo';
    let color = 'text-emerald-400'; // Tailwind classes
    let statusColor = 'bg-emerald-500';

    if (score >= 4) {
        level = 'Medio';
        color = 'text-amber-400';
        statusColor = 'bg-amber-500';
    }
    if (score >= 6) {
        level = 'Alto';
        color = 'text-rose-500';
        statusColor = 'bg-rose-500';
    }

    return {
        score,
        level,
        color,       // For text
        statusColor, // For backgrounds/badges
        issues,      // Array of specific problems detected
        details: {
            trunk: trunkVal,
            neck: neckVal,
            symmetry: symmetryDiff
        }
    };
};
