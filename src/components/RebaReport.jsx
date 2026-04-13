import React from 'react';
import { getProfileRecommendations } from '../utils/ergonomics';

/* ─── Tablas REBA ──────────────────────────────────────────────────────────── */
const tableA = [
    [[1,2,3],[2,3,4],[3,4,5],[4,5,6]],
    [[1,2,3],[2,3,4],[4,5,6],[5,6,7]],
    [[3,3,5],[4,5,6],[5,6,7],[6,7,8]],
    [[4,5,6],[5,6,7],[6,7,8],[7,8,9]],
    [[6,7,8],[7,8,9],[8,9,9],[9,9,9]],
];
const tableB = [
    [[1,2,2],[1,2,3]],[[1,2,3],[2,3,4]],[[3,4,5],[4,5,5]],
    [[4,5,5],[5,6,7]],[[6,7,8],[7,8,8]],[[7,8,8],[8,9,9]],
];
const tableC = [
    [1,1,1,2,3,3,4,5,6,7,7,7],[1,2,2,3,4,4,5,6,6,7,7,8],[2,3,3,3,4,5,6,7,7,8,8,8],
    [3,4,4,4,5,6,7,8,8,9,9,9],[4,4,4,5,6,7,8,8,9,9,9,9],[6,6,6,7,8,8,9,9,10,10,10,10],
    [7,7,7,8,9,9,9,10,10,11,11,11],[8,8,8,9,10,10,10,10,10,11,11,11],[9,9,9,10,10,10,11,11,11,12,12,12],
    [10,10,10,11,11,11,11,12,12,12,12,12],[11,11,11,11,12,12,12,12,12,12,12,12],[12,12,12,12,12,12,12,12,12,12,12,12],
];

/* inline style helpers */
const th = { border:'1px solid #71717a', padding:'3px 5px', fontWeight:700, background:'#f4f4f5', textAlign:'center', fontSize:8 };
const td = (isAct, val) => ({
    border:'1px solid #a1a1aa',
    padding:'3px 5px',
    textAlign:'center',
    fontSize:8,
    fontWeight: isAct ? 900 : 400,
    background: isAct ? riskCellColor(val) : '#fff',
    color: isAct ? '#fff' : '#3f3f46',
    outline: isAct ? `2px solid ${riskCellColor(val)}` : 'none',
});
function riskCellColor(v) {
    if (v >= 9) return '#b91c1c';
    if (v >= 7) return '#dc2626';
    if (v >= 5) return '#f97316';
    if (v >= 3) return '#f59e0b';
    return '#059669';
}

const RebaReport = ({ angles, risk, settings, riskHistory = [], segmentStatus = {}, reportImage }) => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES');

    if (!risk?.subScores) return null;

    const { subScores: sub } = risk;
    const profileName = settings?.workProfile || 'oficina';
    const profileRecommendations = getProfileRecommendations(profileName);
    const avgScore = riskHistory.length > 0
        ? (riskHistory.reduce((acc, item) => acc + item.score, 0) / riskHistory.length).toFixed(1)
        : risk.score;
    const maxScore = riskHistory.length > 0
        ? Math.max(...riskHistory.map(item => item.score))
        : risk.score;

    /* active cells for table highlights */
    const aT = Math.min(Math.max((sub.trunk    ||1)-1,0),4);
    const aN = Math.min(Math.max((sub.neck     ||1)-1,0),2);
    const aL = Math.min(Math.max((sub.legs     ||1)-1,0),1);
    const bU = Math.min(Math.max((sub.upperArm ||1)-1,0),5);
    const bLo= Math.min(Math.max((sub.lowerArm ||1)-1,0),1);
    const bW = Math.min(Math.max((sub.wrist    ||1)-1,0),2);
    const cA = Math.min(Math.max((sub.scoreA   ||1)-1,0),11);
    const cB = Math.min(Math.max((sub.scoreB   ||1)-1,0),11);

    const riskColor = risk.score >= 11 ? '#dc2626'
        : risk.score >= 8 ? '#f97316'
        : risk.score >= 4 ? '#f59e0b' : '#059669';

    return (
        <div className="print-report hidden print:block w-full text-black bg-white p-5 font-sans" style={{ fontFamily:'Arial, sans-serif', fontSize:10 }}>

            {/* ══ HEADER ═══════════════════════════════════════════════════ */}
            <div style={{ borderBottom:'3px solid #1e293b', paddingBottom:8, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                    <h1 style={{ fontSize:18, fontWeight:900, textTransform:'uppercase', letterSpacing:2, margin:0, color:'#1e293b' }}>
                        Método R.E.B.A. — Hoja de Campo
                    </h1>
                    <p style={{ margin:'2px 0 0', fontSize:10, color:'#64748b', letterSpacing:1 }}>
                        Sistema de Monitoreo Ergonómico de Postura · SMEP v1.0
                    </p>
                </div>
                <div style={{ textAlign:'right', fontSize:9, color:'#64748b' }}>
                    <p><strong>Fecha y Hora:</strong> {dateStr}</p>
                    <p><strong>Analista:</strong> Sistema SMEP · Cámara + IA</p>
                    <p><strong>Perfil:</strong> {profileName}</p>
                </div>
            </div>

            {/* ══ EVIDENCIA VISUAL ══════════════════════════════════════════ */}
            <div style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:8, marginBottom:12 }}>
                <div style={{ background:'#f1f5f9', margin:'-8px -8px 8px', padding:'5px 10px', borderRadius:'8px 8px 0 0', borderBottom:'1px solid #e2e8f0', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>
                    Evidencia Visual de Postura
                </div>
                {reportImage ? (
                    <img src={reportImage} alt="Captura de postura" style={{ width:'100%', maxHeight:180, objectFit:'contain', borderRadius:4 }} />
                ) : (
                    <div style={{ height:60, border:'1px dashed #cbd5e1', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:9 }}>
                        Sin imagen. Inicia monitoreo antes de imprimir.
                    </div>
                )}
            </div>

            {/* ══ GRUPOS A y B  ════════════════════════════════════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>

                {/* GRUPO A */}
                <div style={{ border:'1.5px solid #86efac', borderRadius:8, overflow:'hidden' }}>
                    <div style={{ background:'#16a34a', color:'#fff', padding:'5px 10px', fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:1, display:'flex', justifyContent:'space-between' }}>
                        <span>Grupo A: Cuello, Tronco y Piernas</span>
                        <span>Puntaje A = {sub.scoreA}</span>
                    </div>
                    <div style={{ padding:8 }}>
                        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:6 }}>
                            <thead>
                                <tr>
                                    <th style={th}>Segmento</th>
                                    <th style={th}>Movimiento</th>
                                    <th style={th}>Puntaje</th>
                                    <th style={th}>Ángulo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Cuello</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {(sub.adjustedNeck||0)<=10?'0–10° flexión':(sub.adjustedNeck||0)<=20?'11–20° flexión':'>20° flexión/extensión'}
                                    </td>
                                    <td style={{...th, background:'#f0fdf4', color:'#15803d'}}>{sub.neck}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>{Math.round(sub.adjustedNeck||0)}°</td>
                                </tr>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Tronco</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {(sub.adjustedTrunk||0)<=5?'Erguido':(sub.adjustedTrunk||0)<=20?'0–20° flex':(sub.adjustedTrunk||0)<=60?'21–60° flex':'>60° flex'}
                                    </td>
                                    <td style={{...th, background:'#f0fdf4', color:'#15803d'}}>{sub.trunk}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>{Math.round(sub.adjustedTrunk||0)}°</td>
                                </tr>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Piernas</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {sub.legs===1?'Soporte bilateral / sentado':'Soporte unilateral / inestable'}
                                    </td>
                                    <td style={{...th, background:'#f0fdf4', color:'#15803d'}}>{sub.legs}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>–</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Tabla A */}
                        <div style={{ fontSize:8, fontWeight:700, color:'#64748b', marginBottom:3, textTransform:'uppercase' }}>Tabla A (celda activa resaltada)</div>
                        <table style={{ borderCollapse:'collapse', width:'100%', fontSize:8 }}>
                            <thead>
                                <tr>
                                    <th style={th}>T\N</th>
                                    {[0,1,2].map(ni=>(
                                        <th key={ni} colSpan={2} style={{...th, background: aN===ni?'#dcfce7':'#f4f4f5', color: aN===ni?'#166534':'#52525b'}}>
                                            Cuello {ni+1}
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    <th style={th}></th>
                                    {[0,1,2].map(ni=>[0,1].map(li=><th key={`${ni}-${li}`} style={th}>P{li+1}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableA.map((nRows,ti)=>(
                                    <tr key={ti}>
                                        <td style={{...th, background:aT===ti?'#dbeafe':'#f4f4f5', color:aT===ti?'#1d4ed8':'#52525b'}}>T{ti+1}</td>
                                        {nRows.slice(0,3).map((lArr,ni)=>lArr.slice(0,2).map((val,li)=>{
                                            const isAct = aT===ti&&aN===ni&&aL===li;
                                            return <td key={`${ni}-${li}`} style={td(isAct,val)}>{val}</td>;
                                        }))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, fontSize:9, color:'#64748b' }}>
                            + Carga/Fuerza: 0 &nbsp;→&nbsp; <strong style={{ color:'#16a34a' }}>Puntaje A = {sub.scoreA}</strong>
                        </div>
                    </div>
                </div>

                {/* GRUPO B */}
                <div style={{ border:'1.5px solid #93c5fd', borderRadius:8, overflow:'hidden' }}>
                    <div style={{ background:'#1d4ed8', color:'#fff', padding:'5px 10px', fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:1, display:'flex', justifyContent:'space-between' }}>
                        <span>Grupo B: Brazos, Antebrazos, Muñecas</span>
                        <span>Puntaje B = {sub.scoreB}</span>
                    </div>
                    <div style={{ padding:8 }}>
                        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:6 }}>
                            <thead>
                                <tr>
                                    <th style={th}>Segmento</th>
                                    <th style={th}>Movimiento</th>
                                    <th style={th}>Puntaje</th>
                                    <th style={th}>Ángulo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Brazos</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {sub.upperArm<=1?'0–20° flex':(sub.upperArm<=2?'21–45°':(sub.upperArm<=3?'46–90°':'>90°'))}
                                    </td>
                                    <td style={{...th, background:'#eff6ff', color:'#1d4ed8'}}>{sub.upperArm}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        Iz:{Math.round(angles?.shoulder_l||0)}° Dr:{Math.round(angles?.shoulder_r||0)}°
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Antebrazos</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {sub.lowerArm===1?'60–100° flexión':'<60° o >100°'}
                                    </td>
                                    <td style={{...th, background:'#eff6ff', color:'#1d4ed8'}}>{sub.lowerArm}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        Iz:{Math.round(angles?.elbow_l||0)}° Dr:{Math.round(angles?.elbow_r||0)}°
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{...th, background:'#fff', fontWeight:600}}>Muñecas</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        {sub.wrist===1?'0–15° flex/ext':'> 15° flex/ext'}
                                    </td>
                                    <td style={{...th, background:'#eff6ff', color:'#1d4ed8'}}>{sub.wrist}</td>
                                    <td style={{...th, background:'#fff', fontWeight:400}}>
                                        Iz:{Math.round(angles?.wrist_l||0)}° Dr:{Math.round(angles?.wrist_r||0)}°
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Tabla B */}
                        <div style={{ fontSize:8, fontWeight:700, color:'#64748b', marginBottom:3, textTransform:'uppercase' }}>Tabla B (celda activa resaltada)</div>
                        <table style={{ borderCollapse:'collapse', width:'100%', fontSize:8 }}>
                            <thead>
                                <tr>
                                    <th style={th}>B\A</th>
                                    <th colSpan={3} style={{...th, background:bLo===0?'#dbeafe':'#f4f4f5', color:bLo===0?'#1d4ed8':'#52525b'}}>Antebrazo 1</th>
                                    <th colSpan={3} style={{...th, background:bLo===1?'#dbeafe':'#f4f4f5', color:bLo===1?'#1d4ed8':'#52525b'}}>Antebrazo 2</th>
                                </tr>
                                <tr>
                                    <th style={th}></th>
                                    {[0,1].map(lo=>[0,1,2].map(w=><th key={`${lo}-${w}`} style={th}>M{w+1}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableB.map((lRows,ui)=>(
                                    <tr key={ui}>
                                        <td style={{...th, background:bU===ui?'#ede9fe':'#f4f4f5', color:bU===ui?'#6d28d9':'#52525b'}}>B{ui+1}</td>
                                        {lRows.map((wArr,li)=>wArr.map((val,wi)=>{
                                            const isAct=bU===ui&&bLo===li&&bW===wi;
                                            return <td key={`${li}-${wi}`} style={td(isAct,val)}>{val}</td>;
                                        }))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, fontSize:9, color:'#64748b' }}>
                            + Agarre: 0 &nbsp;→&nbsp; <strong style={{ color:'#1d4ed8' }}>Puntaje B = {sub.scoreB}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ TABLA C ════════════════════════════════════════════════════ */}
            <div style={{ border:'1.5px solid #c4b5fd', borderRadius:8, overflow:'hidden', marginBottom:10 }}>
                <div style={{ background:'#7c3aed', color:'#fff', padding:'5px 10px', fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:1, display:'flex', justifyContent:'space-between' }}>
                    <span>Tabla C · Puntaje A={sub.scoreA} × Puntaje B={sub.scoreB} → C={sub.scoreC}</span>
                    <span>+ Actividad: 1  →  Total = {risk.score}</span>
                </div>
                <div style={{ padding:8 }}>
                    <table style={{ borderCollapse:'collapse', width:'100%', fontSize:8 }}>
                        <thead>
                            <tr>
                                <th style={th}>A\B</th>
                                {Array.from({length:12},(_,i)=>i+1).map(n=>(
                                    <th key={n} style={{...th, background:cB===n-1?'#dbeafe':'#f4f4f5', color:cB===n-1?'#1d4ed8':'#52525b'}}>{n}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableC.map((row,ai)=>(
                                <tr key={ai}>
                                    <td style={{...th, background:cA===ai?'#dcfce7':'#f4f4f5', color:cA===ai?'#16a34a':'#52525b'}}>{ai+1}</td>
                                    {row.map((val,bi)=>{
                                        const isAct=cA===ai&&cB===bi;
                                        return <td key={bi} style={td(isAct,val)}>{val}</td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══ PUNTUACIÓN FINAL ═══════════════════════════════════════════ */}
            <div style={{ border:`3px solid ${riskColor}`, borderRadius:10, padding:12, marginBottom:10, display:'grid', gridTemplateColumns:'auto 1fr 1fr', gap:16, alignItems:'center' }}>
                <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1 }}>Puntuación REBA</div>
                    <div style={{ fontSize:52, fontWeight:900, color:riskColor, lineHeight:1 }}>{risk.score}</div>
                    <div style={{ fontSize:10, color:'#94a3b8' }}>/ 15</div>
                </div>
                <div>
                    <div style={{ fontSize:9, fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:4 }}>Nivel de Riesgo</div>
                    <div style={{ fontSize:18, fontWeight:900, color:riskColor }}>{risk.level}</div>
                    <div style={{ fontSize:10, color:'#64748b', marginTop:4 }}>{risk.action}</div>
                </div>
                <div>
                    <div style={{ fontSize:9, fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:4 }}>Estadísticas de Sesión</div>
                    <div style={{ fontSize:10, color:'#475569' }}><strong>Promedio:</strong> REBA {avgScore}</div>
                    <div style={{ fontSize:10, color:'#475569' }}><strong>Pico:</strong> REBA {maxScore}</div>
                    <div style={{ fontSize:10, color:'#475569' }}><strong>Perfil:</strong> {profileName}</div>
                </div>
            </div>

            {/* ── Escala de Acción ────────────────────────────────────────── */}
            <div style={{ display:'flex', height:12, borderRadius:6, overflow:'hidden', border:'1px solid #e2e8f0', marginBottom:8 }}>
                {[
                    {lo:1,hi:1,c:'#94a3b8',label:'Inapreciable'},
                    {lo:2,hi:3,c:'#10b981',label:'Bajo'},
                    {lo:4,hi:7,c:'#f59e0b',label:'Medio'},
                    {lo:8,hi:10,c:'#f97316',label:'Alto'},
                    {lo:11,hi:15,c:'#ef4444',label:'Muy Alto'},
                ].map(({lo,hi,c,label})=>{
                    const w = (hi-lo+1)/15*100;
                    const isAct = risk.score>=lo&&risk.score<=hi;
                    return (
                        <div key={label} style={{ flex:`${w}%`, background:c, opacity:isAct?1:0.3, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontSize:6, color:'#fff', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>{isAct?label:''}</span>
                        </div>
                    );
                })}
            </div>
            <p style={{ fontSize:7, color:'#94a3b8', textAlign:'center', marginBottom:10 }}>
                NIVEL DE ACCIÓN: 1 = No necesario; 2-3 = Puede ser necesario; 4 a 7 = Necesario; 8 a 10 = Necesario pronto; 11 a 15 = Actuación inmediata
            </p>

            {/* ══ SEMÁFORO + RECOMENDACIONES ════════════════════════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                <div style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:8 }}>
                    <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', color:'#334155', borderBottom:'1px solid #e2e8f0', paddingBottom:4, marginBottom:6 }}>Semáforo Segmentario</div>
                    {Object.entries(segmentStatus).map(([key, value]) => {
                        const st = value?.status || 'ok';
                        const stColor = st === 'risk' ? '#dc2626' : st === 'warn' ? '#f59e0b' : '#059669';
                        return (
                            <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', borderBottom:'1px solid #f1f5f9', fontSize:9 }}>
                                <span style={{ fontWeight:600, color:'#475569', textTransform:'capitalize' }}>{key}</span>
                                <span style={{ fontWeight:700, color:stColor, padding:'1px 6px', borderRadius:4, background:stColor+'11', border:`1px solid ${stColor}33` }}>
                                    {Math.round(value?.value || 0)} · {st.toUpperCase()}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:8 }}>
                    <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', color:'#334155', borderBottom:'1px solid #e2e8f0', paddingBottom:4, marginBottom:6 }}>Recomendaciones</div>
                    <ul style={{ margin:0, paddingLeft:12, fontSize:9, color:'#475569', lineHeight:1.7 }}>
                        {(risk.recommendations || []).slice(0, 3).map((rec, idx) => (
                            <li key={`risk-${idx}`}>{rec}</li>
                        ))}
                        {profileRecommendations.slice(0,3).map((rec, idx) => (
                            <li key={`profile-${idx}`}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Ángulos Biométricos ─────────────────────────────────────── */}
            <div style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:8 }}>
                <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', color:'#334155', borderBottom:'1px solid #e2e8f0', paddingBottom:4, marginBottom:6 }}>
                    Ángulos Biométricos Detectados
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'4px 12px', fontSize:9, color:'#475569' }}>
                    <span><strong>Cuello:</strong> {Math.round(angles.neck||0)}°</span>
                    <span><strong>Tronco:</strong> {Math.round(angles.trunk||0)}°</span>
                    <span><strong>Brazo Iz:</strong> {Math.round(angles.shoulder_l||0)}°</span>
                    <span><strong>Brazo Dr:</strong> {Math.round(angles.shoulder_r||0)}°</span>
                    <span><strong>Codo Iz:</strong> {Math.round(angles.elbow_l||0)}°</span>
                    <span><strong>Codo Dr:</strong> {Math.round(angles.elbow_r||0)}°</span>
                    <span><strong>Muñeca Iz:</strong> {Math.round(angles.wrist_l||0)}°</span>
                    <span><strong>Muñeca Dr:</strong> {Math.round(angles.wrist_r||0)}°</span>
                    <span><strong>Rodilla Iz:</strong> {Math.round(angles.knee_l||0)}°</span>
                    <span><strong>Rodilla Dr:</strong> {Math.round(angles.knee_r||0)}°</span>
                    <span><strong>Cadera Iz:</strong> {Math.round(angles.hip_l||0)}°</span>
                    <span><strong>Cadera Dr:</strong> {Math.round(angles.hip_r||0)}°</span>
                </div>
            </div>

            <p style={{ textAlign:'center', fontSize:7, color:'#94a3b8', marginTop:10, fontStyle:'italic' }}>
                Generado por SMEP (Sistema de Monitoreo Ergonómico de Postura) · Universidad José Antonio Páez · Tecnología MediaPipe + IA
            </p>
        </div>
    );
};

export default RebaReport;
