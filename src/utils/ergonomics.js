/**
 * REBA Assessment Scoring Logic
 */

// Step 1: Neck Score (1-3)
const getNeckScore = (angle) => {
    if (angle >= 0 && angle <= 20) return 1;
    return 2;
    // Add +1 if twisting or side-bending (simplified here)
};

// Step 2: Trunk Score (1-5)
const getTrunkScore = (angle) => {
    if (angle >= 0 && angle <= 5) return 1; // upright
    if (angle > 5 && angle <= 20) return 2;
    if (angle > 20 && angle <= 60) return 3;
    return 4; // > 60
    // Add +1 if twisting or side-bending 
};

// Step 3: Legs Score (1-2)
const getLegScore = (kneeAngle) => {
    // Simplified: assuming bilateral support for standing desk.
    // If knees are bent (30-60 deg) we add +1 or +2.
    // Using 1 for basic standing posture.
    return 1;
};

// REBA Table A (Trunk, Neck, Legs)
const tableA = [
    // Trunk 1
    [[1, 2, 2], [2, 3, 4], [3, 4, 5]], // Neck 1, 2, 3 (each array is Leg 1, 2, 3... we only have Leg 1,2)
    // Trunk 2
    [[2, 3, 4], [3, 4, 5], [4, 5, 6]],
    // Trunk 3
    [[3, 4, 5], [4, 5, 6], [5, 6, 7]],
    // Trunk 4
    [[4, 5, 6], [5, 6, 7], [6, 7, 8]],
    // Trunk 5
    [[5, 6, 7], [6, 7, 8], [7, 8, 9]]
];

const getScoreA = (trunk, neck, legs) => {
    // bounds check
    const t = Math.min(Math.max(trunk - 1, 0), 4);
    const n = Math.min(Math.max(neck - 1, 0), 2);
    const l = Math.min(Math.max(legs - 1, 0), 2); // usually just 0 or 1
    return tableA[t][n][l];
};

// Step 4: Upper Arm Score (1-6)
const getUpperArmScore = (angle) => {
    if (angle >= -20 && angle <= 20) return 1;
    if (angle > 20 && angle <= 45) return 2;
    // extension > 20 is also 2
    if (angle < -20) return 2;
    if (angle > 45 && angle <= 90) return 3;
    return 4; // > 90
    // +1 if abducted or rotated
    // -1 if supported/leaning
};

// Step 5: Lower Arm Score (1-2)
const getLowerArmScore = (angle) => {
    if (angle >= 60 && angle <= 100) return 1;
    return 2; // < 60 or > 100
};

// Step 6: Wrist Score (1-3)
const getWristScore = (angle) => {
    if (angle >= 0 && angle <= 15) return 1;
    return 2; // > 15 flex/ext
    // +1 if twisted
};

// REBA Table B (Upper Arm, Lower Arm, Wrist)
const tableB = [
    // Upper Arm 1
    [[1, 2, 2], [1, 2, 3]], // Lower Arm 1 (Wrist 1,2,3), Lower Arm 2
    // Upper Arm 2
    [[1, 2, 3], [2, 3, 4]],
    // Upper Arm 3
    [[3, 4, 5], [4, 5, 5]],
    // Upper Arm 4
    [[4, 5, 5], [5, 6, 7]],
    // Upper Arm 5
    [[6, 7, 8], [7, 8, 8]],
    // Upper Arm 6
    [[7, 8, 8], [8, 9, 9]]
];

const getScoreB = (upper, lower, wrist) => {
    const u = Math.min(Math.max(upper - 1, 0), 5);
    const l = Math.min(Math.max(lower - 1, 0), 1);
    const w = Math.min(Math.max(wrist - 1, 0), 2);
    return tableB[u][l][w];
};

// REBA Table C
const tableC = [
    [1, 1, 1, 2, 3, 3, 4, 5, 6, 7, 7, 7],
    [1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8],
    [2, 3, 3, 3, 4, 5, 6, 7, 7, 8, 8, 8],
    [3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9],
    [4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9],
    [6, 6, 6, 7, 8, 8, 9, 9, 10, 10, 10, 10],
    [7, 7, 7, 8, 9, 9, 9, 10, 10, 11, 11, 11],
    [8, 8, 8, 9, 10, 10, 10, 10, 10, 11, 11, 11],
    [9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12],
    [10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12],
    [11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
];

const getScoreC = (scoreA, scoreB) => {
    const a = Math.min(Math.max(scoreA - 1, 0), 11);
    const b = Math.min(Math.max(scoreB - 1, 0), 11);
    return tableC[a][b];
};

export const evaluateRiskREBA = (angles) => {
    // Get individual scores (using worst side for limbs)
    const trunkScore = getTrunkScore(angles.trunk);
    const neckScore = getNeckScore(angles.neck);
    const legsScore = getLegScore(Math.max(angles.knee_l, angles.knee_r));

    const upperArmAng = Math.max(Math.abs(angles.shoulder_l || 0), Math.abs(angles.shoulder_r || 0)); // Approx using raw Y height difference as angle proxy
    const lowerArmAng = Math.max(angles.elbow_l, angles.elbow_r);
    const wristAng = Math.max(angles.wrist_l, angles.wrist_r);

    const upperScore = Math.max(getUpperArmScore(angles.shoulder_l_angle || upperArmAng), getUpperArmScore(angles.shoulder_r_angle || upperArmAng));
    const lowerScore = Math.max(getLowerArmScore(angles.elbow_l), getLowerArmScore(angles.elbow_r));
    const wristScore = Math.max(getWristScore(angles.wrist_l), getWristScore(angles.wrist_r));

    // Base Scores
    const scoreA = getScoreA(trunkScore, neckScore, legsScore);
    const loadForceScore = 0; // Assuming < 5 kg
    const finalScoreA = scoreA + loadForceScore;

    const scoreB = getScoreB(upperScore, lowerScore, wristScore);
    const couplingScore = 0; // Assuming good grip
    const finalScoreB = scoreB + couplingScore;

    const scoreC = getScoreC(finalScoreA, finalScoreB);
    const activityScore = 1; // Assuming 1 or more body parts are static > 1 min

    const finalREBAScore = scoreC + activityScore;

    // Determine Risk Level from REBA Score
    let level = 'Inapreciable';
    let color = 'text-emerald-400';
    let statusColor = 'bg-emerald-500';
    let action = 'No es necesaria acción';

    if (finalREBAScore >= 2 && finalREBAScore <= 3) {
        level = 'Bajo';
        color = 'text-green-400';
        statusColor = 'bg-green-500';
        action = 'Puede ser necesaria acción';
    } else if (finalREBAScore >= 4 && finalREBAScore <= 7) {
        level = 'Medio';
        color = 'text-amber-400';
        statusColor = 'bg-amber-500';
        action = 'Es necesaria acción';
    } else if (finalREBAScore >= 8 && finalREBAScore <= 10) {
        level = 'Alto';
        color = 'text-orange-500';
        statusColor = 'bg-orange-500';
        action = 'Es necesaria acción pronto';
    } else if (finalREBAScore >= 11) {
        level = 'Muy Alto';
        color = 'text-rose-500';
        statusColor = 'bg-rose-500';
        action = 'Es necesaria acción inmediata';
    }

    return {
        score: finalREBAScore, // 1-15
        level,
        color,
        statusColor,
        action,
        subScores: {
            trunk: trunkScore,
            neck: neckScore,
            legs: legsScore,
            scoreA: finalScoreA,
            upperArm: upperScore,
            lowerArm: lowerScore,
            wrist: wristScore,
            scoreB: finalScoreB,
            scoreC: scoreC,
            activity: activityScore
        }
    };
};

// Keep old angle calc generic
export const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return 0;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};
