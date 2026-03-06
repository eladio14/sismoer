/**
 * REBA Assessment Scoring Logic (adapted for office posture monitoring)
 */

const compensatedAngle = (raw = 0, baseline = 0, deadzone = 0) => {
    const delta = Math.abs(raw - baseline);
    return Math.max(0, delta - deadzone);
};

// Step 1: Neck Score (1-3)
const getNeckScore = (angle) => {
    if (angle <= 10) return 1;
    if (angle <= 20) return 2;
    return 3;
};

// Step 2: Trunk Score (1-5)
const getTrunkScore = (angle) => {
    if (angle <= 5) return 1;
    if (angle <= 20) return 2;
    if (angle <= 60) return 3;
    return 4;
};

// Step 3: Legs Score (1-2)
const getLegScore = (kneeAngle) => {
    // MediaPipe gives ~180° for fully extended knee.
    const bend = Math.abs(180 - (kneeAngle || 180));
    return bend > 30 ? 2 : 1;
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
    const abs = Math.abs(angle || 0);
    if (abs <= 20) return 1;
    if (abs <= 45) return 2;
    if (abs <= 90) return 3;
    return 4;
};

// Step 5: Lower Arm Score (1-2)
const getLowerArmScore = (angle) => {
    if (angle >= 60 && angle <= 100) return 1;
    return 2;
};

// Step 6: Wrist Score (1-3)
const getWristScore = (angle) => {
    // MediaPipe wrist angle tends to be closer to 180° when neutral.
    const deviation = Math.abs(180 - (angle || 180));
    if (deviation <= 15) return 1;
    return 2;
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

export const evaluateRiskREBA = (angles, calibration = {}, options = {}) => {
    const deadzone = options.deadzone ?? 0;

    const adjustedNeck = compensatedAngle(angles.neck, calibration.neck || 0, deadzone);
    const adjustedTrunk = compensatedAngle(angles.trunk, calibration.trunk || 0, deadzone);

    // Get individual scores (using worst side for limbs)
    const trunkScore = getTrunkScore(adjustedTrunk);
    const neckScore = getNeckScore(adjustedNeck);
    const legsScore = getLegScore(Math.max(angles.knee_l || 180, angles.knee_r || 180));

    const upperScore = Math.max(getUpperArmScore(angles.shoulder_l), getUpperArmScore(angles.shoulder_r));
    const lowerScore = Math.max(getLowerArmScore(angles.elbow_l || 0), getLowerArmScore(angles.elbow_r || 0));
    const wristScore = Math.max(getWristScore(angles.wrist_l || 180), getWristScore(angles.wrist_r || 180));

    // Base Scores
    const scoreA = getScoreA(trunkScore, neckScore, legsScore);
    const loadForceScore = 0; // Assuming < 5 kg
    const finalScoreA = scoreA + loadForceScore;

    const scoreB = getScoreB(upperScore, lowerScore, wristScore);
    const couplingScore = 0; // Assuming good grip
    const finalScoreB = scoreB + couplingScore;

    const scoreC = getScoreC(finalScoreA, finalScoreB);
    const activityScore = 1; // static office activity baseline

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

    const issues = [];
    const recommendations = [];

    if (adjustedNeck > 20) {
        issues.push('Flexión cervical elevada');
        recommendations.push('Sube la pantalla a la altura de los ojos y acerca el teclado.');
    }
    if (adjustedTrunk > 20) {
        issues.push('Inclinación de tronco por encima de zona segura');
        recommendations.push('Apoya la espalda en el respaldo y acerca la silla al escritorio.');
    }
    const shoulderDiff = Math.abs((angles.shoulder_height_l || 0) - (angles.shoulder_height_r || 0));
    if (shoulderDiff > 4) {
        issues.push('Asimetría de hombros');
        recommendations.push('Centra el monitor y distribuye el apoyo de ambos antebrazos.');
    }
    if (Math.abs(180 - (angles.elbow_l || 180)) > 80 || Math.abs(180 - (angles.elbow_r || 180)) > 80) {
        issues.push('Ángulo de codo fuera de rango confortable');
        recommendations.push('Ajusta altura de silla para mantener codos cercanos a 90°.');
    }

    return {
        score: finalREBAScore, // 1-15
        level,
        color,
        statusColor,
        action,
        issues,
        recommendations,
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
            activity: activityScore,
            adjustedTrunk,
            adjustedNeck
        }
    };
};

export const getProfileRecommendations = (profile = 'oficina') => {
    const common = [
        'Aplicar pausa activa de 2 a 3 minutos cada 30-45 minutos.',
        'Mantener pies apoyados y cadera cerca de 90-100° de flexión.',
        'Evitar posiciones estáticas prolongadas: alternar postura sentado/de pie cuando sea posible.'
    ];

    const byProfile = {
        oficina: [
            'Alinear borde superior del monitor a la altura de los ojos.',
            'Mantener teclado y mouse a la misma altura para reducir asimetrías de hombro.'
        ],
        callcenter: [
            'Usar diadema bilateral en lugar de sostener teléfono con cuello/hombro.',
            'Ajustar sensibilidad del micrófono para evitar protracción cervical.'
        ],
        diseno: [
            'Usar atajos de teclado/tableta para disminuir repetición de muñeca dominante.',
            'Acercar pantalla secundaria al eje visual principal para reducir rotación cervical.'
        ],
        desarrollo: [
            'Dividir pantalla con tipografía legible para evitar adelantar la cabeza.',
            'Programar microdescansos visuales con regla 20-20-20.'
        ]
    };

    return [...common, ...(byProfile[profile] || byProfile.oficina)];
};

// Keep old angle calc generic
export const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return 0;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};
