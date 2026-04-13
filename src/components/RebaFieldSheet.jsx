import React, { useMemo } from 'react';
import { Printer } from 'lucide-react';

/* ── REBA Tables ──────────────────────────────────────────────────────────── */
const tableA = [
    [[1,2,3],[2,3,4],[3,4,5],[4,5,6]],
    [[1,2,3],[2,3,4],[4,5,6],[5,6,7]],
    [[3,3,5],[4,5,6],[5,6,7],[6,7,8]],
    [[4,5,6],[5,6,7],[6,7,8],[7,8,9]],
    [[6,7,8],[7,8,9],[8,9,9],[9,9,9]],
];
const tableB = [
    [[1,2,2],[1,2,3]],
    [[1,2,3],[2,3,4]],
    [[3,4,5],[4,5,5]],
    [[4,5,5],[5,6,7]],
    [[6,7,8],[7,8,8]],
    [[7,8,8],[8,9,9]],
];
const tableC = [
    [1,1,1,2,3,3,4,5,6,7,7,7],
    [1,2,2,3,4,4,5,6,6,7,7,8],
    [2,3,3,3,4,5,6,7,7,8,8,8],
    [3,4,4,4,5,6,7,8,8,9,9,9],
    [4,4,4,5,6,7,8,8,9,9,9,9],
    [6,6,6,7,8,8,9,9,10,10,10,10],
    [7,7,7,8,9,9,9,10,10,11,11,11],
    [8,8,8,9,10,10,10,10,10,11,11,11],
    [9,9,9,10,10,10,11,11,11,12,12,12],
    [10,10,10,11,11,11,11,12,12,12,12,12],
    [11,11,11,11,12,12,12,12,12,12,12,12],
    [12,12,12,12,12,12,12,12,12,12,12,12],
];

function isPersonSitting(angles) {
    if (!angles) return false;
    const kneeL = angles.knee_l || 180;
    const kneeR = angles.knee_r || 180;
    const hipL  = angles.hip_l  || 180;
    const hipR  = angles.hip_r  || 180;
    return ((kneeL + kneeR) / 2 < 140) || ((hipL + hipR) / 2 < 140);
}

/* ── Small helpers ────────────────────────────────────────────────────────── */
const cellBg = (val) => {
    if (val >= 9) return '#b91c1c';
    if (val >= 7) return '#dc2626';
    if (val >= 5) return '#f97316';
    if (val >= 3) return '#f59e0b';
    return '#10b981';
};

function ScoreBox({ label, value, color = '#3b82f6', small = false }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border"
            style={{ borderColor: color + '44', background: color + '11', minWidth: small ? 36 : 48, padding: '4px 6px' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontSize: small ? 15 : 20, fontWeight: 900, color, lineHeight: 1 }}>{value ?? '–'}</span>
        </div>
    );
}

/* ── TABLE A cell grid ────────────────────────────────────────────────────── */
function TableAGrid({ active }) {
    /* tableA[trunk][neck][leg] – trunk 0-4, neck 0-2, leg 0-1 */
    const neckLabels = ['Cuello 1','Cuello 2','Cuello 3'];
    const legLabels  = ['P1','P2'];
    return (
        <div className="overflow-x-auto">
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 9 }}>
                <thead>
                    <tr>
                        <th style={thS}>T</th>
                        {neckLabels.map((n,ni) => (
                            <th key={n} colSpan={2} style={{
                                ...thS,
                                background: active?.n === ni ? '#d1fae5' : '#f8fafc',
                                color: active?.n === ni ? '#065f46' : '#64748b'
                            }}>{n}</th>
                        ))}
                    </tr>
                    <tr>
                        <th style={thS}></th>
                        {[0,1,2].map(ni => legLabels.map((l,li) => (
                            <th key={`${ni}-${li}`} style={thS}>{l}</th>
                        )))}
                    </tr>
                </thead>
                <tbody>
                    {tableA.map((neckRows, ti) => (
                        <tr key={ti}>
                            <td style={{
                                ...tdS,
                                fontWeight: 900,
                                background: active?.t === ti ? '#dbeafe' : '#f8fafc',
                                color: active?.t === ti ? '#1d4ed8' : '#475569'
                            }}>T{ti+1}</td>
                            {neckRows.slice(0,3).map((legArr,ni) =>
                                legArr.slice(0,2).map((val,li) => {
                                    const isAct = active && active.t===ti && active.n===ni && active.l===li;
                                    return (
                                        <td key={`${ni}-${li}`} style={{
                                            ...tdS,
                                            background: isAct ? cellBg(val) : '#fff',
                                            color: isAct ? '#fff' : '#475569',
                                            fontWeight: isAct ? 900 : 400,
                                            boxShadow: isAct ? `0 0 0 2px ${cellBg(val)}` : 'none',
                                            transform: isAct ? 'scale(1.1)' : 'none',
                                            zIndex: isAct ? 2 : 1,
                                            position: 'relative',
                                            transition: 'all 0.3s',
                                        }}>{val}</td>
                                    );
                                })
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── TABLE B cell grid ────────────────────────────────────────────────────── */
function TableBGrid({ active }) {
    /* tableB[upper][lower][wrist] */
    return (
        <div className="overflow-x-auto">
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 9 }}>
                <thead>
                    <tr>
                        <th style={thS}>B</th>
                        <th colSpan={3} style={{...thS, background: active?.lo===0?'#dbeafe':'#f8fafc', color: active?.lo===0?'#1d4ed8':'#64748b'}}>Antebrazo 1</th>
                        <th colSpan={3} style={{...thS, background: active?.lo===1?'#dbeafe':'#f8fafc', color: active?.lo===1?'#1d4ed8':'#64748b'}}>Antebrazo 2</th>
                    </tr>
                    <tr>
                        <th style={thS}></th>
                        {[0,1].map(lo => [1,2,3].map(w=> <th key={`${lo}-${w}`} style={thS}>M{w}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {tableB.map((lowerRows,ui) => (
                        <tr key={ui}>
                            <td style={{
                                ...tdS, fontWeight:900,
                                background: active?.u===ui?'#ede9fe':'#f8fafc',
                                color: active?.u===ui?'#6d28d9':'#475569'
                            }}>B{ui+1}</td>
                            {lowerRows.map((wristArr,li) =>
                                wristArr.map((val,wi) => {
                                    const isAct = active && active.u===ui && active.lo===li && active.w===wi;
                                    return (
                                        <td key={`${li}-${wi}`} style={{
                                            ...tdS,
                                            background: isAct ? cellBg(val) : '#fff',
                                            color: isAct ? '#fff' : '#475569',
                                            fontWeight: isAct ? 900 : 400,
                                            boxShadow: isAct ? `0 0 0 2px ${cellBg(val)}` : 'none',
                                            position: 'relative', transition: 'all 0.3s'
                                        }}>{val}</td>
                                    );
                                })
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── TABLE C cell grid ────────────────────────────────────────────────────── */
function TableCGrid({ active }) {
    return (
        <div className="overflow-x-auto">
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 9 }}>
                <thead>
                    <tr>
                        <th style={thS}>A\B</th>
                        {Array.from({length:12},(_,i)=>i+1).map(n=>(
                            <th key={n} style={{...thS,
                                background: active?.b===n-1?'#dbeafe':'#f8fafc',
                                color: active?.b===n-1?'#1d4ed8':'#64748b'
                            }}>{n}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableC.map((row,ai)=>(
                        <tr key={ai}>
                            <td style={{...tdS, fontWeight:900,
                                background: active?.a===ai?'#d1fae5':'#f8fafc',
                                color: active?.a===ai?'#065f46':'#475569'
                            }}>{ai+1}</td>
                            {row.map((val,bi)=>{
                                const isAct = active && active.a===ai && active.b===bi;
                                return (
                                    <td key={bi} style={{
                                        ...tdS,
                                        background: isAct ? cellBg(val) : '#fff',
                                        color: isAct ? '#fff' : '#475569',
                                        fontWeight: isAct ? 900 : 400,
                                        boxShadow: isAct ? `0 0 0 2px ${cellBg(val)}` : 'none',
                                        position:'relative', transition:'all 0.3s'
                                    }}>{val}</td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thS = { border:'1px solid #e2e8f0', padding:'3px 4px', textAlign:'center', background:'#f8fafc', color:'#64748b', fontWeight:700 };
const tdS = { border:'1px solid #e2e8f0', padding:'3px 4px', textAlign:'center' };

/* ── Angle bar row ────────────────────────────────────────────────────────── */
function AngleRow({ label, score, maxScore, valueTxt, scoreColor }) {
    const pct = Math.min(100, ((score-1)/(maxScore-1))*100);
    const bar = pct < 35 ? '#10b981' : pct < 65 ? '#f59e0b' : '#ef4444';
    return (
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 0', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ width:70, fontSize:10, fontWeight:600, color:'#475569', flexShrink:0 }}>{label}</span>
            <div style={{ flex:1, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:bar, borderRadius:99, transition:'width 0.5s' }} />
            </div>
            <span style={{ fontSize:9, color:'#94a3b8', minWidth:36, textAlign:'right' }}>{valueTxt}</span>
            <div style={{ width:18, height:18, borderRadius:'50%', background: bar+'22', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:10, fontWeight:900, color:bar }}>{score}</span>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
const RebaFieldSheet = ({ angles, risk, onPrint }) => {
    const isSitting = isPersonSitting(angles);
    const sub = risk?.subScores;
    const d = new Date();
    const dateStr = d.toLocaleDateString('es-ES') + '  ' + d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });

    const activeA = useMemo(() => {
        if (!sub) return null;
        const t  = Math.min(Math.max((sub.trunk    ||1)-1,0),4);
        const n  = Math.min(Math.max((sub.neck     ||1)-1,0),2);
        const l  = Math.min(Math.max((sub.legs     ||1)-1,0),1);
        return { t, n, l, value: tableA[t]?.[n]?.[l] ?? 1 };
    }, [sub]);

    const activeB = useMemo(() => {
        if (!sub) return null;
        const u  = Math.min(Math.max((sub.upperArm ||1)-1,0),5);
        const lo = Math.min(Math.max((sub.lowerArm ||1)-1,0),1);
        const w  = Math.min(Math.max((sub.wrist    ||1)-1,0),2);
        return { u, lo, w, value: tableB[u]?.[lo]?.[w] ?? 1 };
    }, [sub]);

    const activeC = useMemo(() => {
        if (!sub) return null;
        const a = Math.min(Math.max((sub.scoreA||1)-1,0),11);
        const b = Math.min(Math.max((sub.scoreB||1)-1,0),11);
        return { a, b, value: tableC[a]?.[b] ?? 1 };
    }, [sub]);

    const finalScore = risk?.score ?? 0;
    const riskPalette = finalScore >= 11 ? { bg:'#fef2f2', border:'#fecaca', text:'#991b1b', fill:'#dc2626' }
        : finalScore >= 8 ? { bg:'#fff7ed', border:'#fed7aa', text:'#9a3412', fill:'#f97316' }
        : finalScore >= 4 ? { bg:'#fffbeb', border:'#fde68a', text:'#92400e', fill:'#f59e0b' }
        : { bg:'#f0fdf4', border:'#bbf7d0', text:'#14532d', fill:'#10b981' };

    /* ── Not yet detected ── */
    if (!sub) {
        return (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40,
                borderRadius:16, border:'2px dashed #e2e8f0', background:'#f8fafc', color:'#94a3b8', gap:8 }}>
                <div style={{ fontSize:36 }}>📊</div>
                <p style={{ fontWeight:700, fontSize:14 }}>Esperando detección de postura…</p>
                <p style={{ fontSize:12 }}>Colócate frente a la cámara para comenzar</p>
            </div>
        );
    }

    return (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>

            {/* ── HEADER ──────────────────────────────────────────────── */}
            <div style={{ background:'linear-gradient(135deg,#1e293b 0%,#334155 100%)', color:'#fff', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div>
                    <div style={{ fontSize:13, fontWeight:900, letterSpacing:'0.05em', textTransform:'uppercase' }}>
                        Método R.E.B.A. · Hoja de Campo
                    </div>
                    <div style={{ fontSize:9, opacity:0.55, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:2 }}>
                        {dateStr}
                    </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{
                        padding:'3px 10px', borderRadius:99, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em',
                        background: isSitting ? 'rgba(96,165,250,0.2)' : 'rgba(52,211,153,0.2)',
                        border: `1px solid ${isSitting ? 'rgba(96,165,250,0.4)' : 'rgba(52,211,153,0.4)'}`,
                        color: isSitting ? '#93c5fd' : '#6ee7b7'
                    }}>
                        {isSitting ? '🪑 Sentado' : '🧍 De Pie'}
                    </span>
                    <span style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:99, fontSize:9, fontWeight:700,
                        background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'none' }}/>
                        EN VIVO
                    </span>
                    {/* Print button */}
                    {onPrint && (
                        <button onClick={onPrint} style={{
                            display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:8, fontSize:10, fontWeight:700,
                            background:'rgba(99,102,241,0.25)', border:'1px solid rgba(99,102,241,0.4)', color:'#c7d2fe', cursor:'pointer',
                            transition:'all 0.2s'
                        }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.45)'}
                            onMouseLeave={e=>e.currentTarget.style.background='rgba(99,102,241,0.25)'}
                        >
                            <Printer size={12}/> Imprimir PDF
                        </button>
                    )}
                </div>
            </div>

            <div style={{ padding: 12, display:'flex', flexDirection:'column', gap:12 }}>

                {/* ── TOP ROW: Grupo A + Grupo B ──────────────────────── */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

                    {/* ── GRUPO A ── */}
                    <div style={{ border:'1.5px solid #bbf7d0', borderRadius:12, overflow:'hidden' }}>
                        <div style={{ background:'#059669', color:'#fff', padding:'7px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em' }}>Grupo A · Cuello, Tronco, Piernas</span>
                            <ScoreBox label="A" value={sub.scoreA} color="#fff" small />
                        </div>

                        <div style={{ padding:'8px 10px' }}>
                            <AngleRow label="Cuello"  score={sub.neck}     maxScore={3} valueTxt={`${Math.round(sub.adjustedNeck||0)}°`}  />
                            <AngleRow label="Tronco"  score={sub.trunk}    maxScore={5} valueTxt={`${Math.round(sub.adjustedTrunk||0)}°`} />
                            <AngleRow label="Piernas" score={sub.legs}     maxScore={2} valueTxt={isSitting?'Sentado':'De pie'} />
                            <div style={{ borderTop:'1px dashed #e2e8f0', marginTop:6, paddingTop:6 }}>
                                <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:4 }}>Tabla A · celda activa</div>
                                <TableAGrid active={activeA} />
                                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, gap:6, alignItems:'center' }}>
                                    <span style={{ fontSize:9, color:'#64748b' }}>Carga/Fuerza: <b>0</b></span>
                                    <span style={{ fontSize:10, fontWeight:800, color:'#059669' }}>Puntaje A = {sub.scoreA}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── GRUPO B ── */}
                    <div style={{ border:'1.5px solid #bfdbfe', borderRadius:12, overflow:'hidden' }}>
                        <div style={{ background:'#2563eb', color:'#fff', padding:'7px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em' }}>Grupo B · Brazos, Antebrazos, Muñecas</span>
                            <ScoreBox label="B" value={sub.scoreB} color="#fff" small />
                        </div>

                        <div style={{ padding:'8px 10px' }}>
                            <AngleRow label="Brazos"     score={sub.upperArm} maxScore={6} valueTxt={`Iz:${Math.round(angles?.shoulder_l||0)}° Dr:${Math.round(angles?.shoulder_r||0)}°`} />
                            <AngleRow label="Antebrazos" score={sub.lowerArm} maxScore={2} valueTxt={`Iz:${Math.round(angles?.elbow_l||0)}° Dr:${Math.round(angles?.elbow_r||0)}°`} />
                            <AngleRow label="Muñecas"    score={sub.wrist}    maxScore={3} valueTxt={`Iz:${Math.round(angles?.wrist_l||0)}° Dr:${Math.round(angles?.wrist_r||0)}°`} />
                            <div style={{ borderTop:'1px dashed #e2e8f0', marginTop:6, paddingTop:6 }}>
                                <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:4 }}>Tabla B · celda activa</div>
                                <TableBGrid active={activeB} />
                                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, gap:6, alignItems:'center' }}>
                                    <span style={{ fontSize:9, color:'#64748b' }}>Agarre: <b>0</b></span>
                                    <span style={{ fontSize:10, fontWeight:800, color:'#2563eb' }}>Puntaje B = {sub.scoreB}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TABLA C ──────────────────────────────────────────── */}
                <div style={{ border:'1.5px solid #ddd6fe', borderRadius:12, overflow:'hidden' }}>
                    <div style={{ background:'#7c3aed', color:'#fff', padding:'7px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                        <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em' }}>Tabla C · Resultado Final REBA</span>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <ScoreBox label="A" value={sub.scoreA} color="#fff" small />
                            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>+</span>
                            <ScoreBox label="B" value={sub.scoreB} color="#fff" small />
                            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>→</span>
                            <ScoreBox label="C" value={sub.scoreC} color="#c4b5fd" small />
                        </div>
                    </div>
                    <div style={{ padding:'8px 10px' }}>
                        <TableCGrid active={activeC} />
                        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, gap:8, alignItems:'center' }}>
                            <span style={{ fontSize:9, color:'#64748b' }}>Actividad estática: <b>+1</b></span>
                            <span style={{ fontSize:11, fontWeight:900, color:'#7c3aed' }}>C={sub.scoreC} + 1 Actividad = Puntaje Final</span>
                        </div>
                    </div>
                </div>

                {/* ── PUNTUACIÓN FINAL ─────────────────────────────────── */}
                <div style={{
                    borderRadius:12, border:`2px solid ${riskPalette.border}`,
                    background: riskPalette.bg,
                    padding:'12px 16px',
                    display:'flex', alignItems:'center', justifyContent:'space-between', gap:12
                }}>
                    <div>
                        <div style={{ fontSize:9, fontWeight:700, color:riskPalette.text, textTransform:'uppercase', letterSpacing:'0.15em', opacity:0.7 }}>Puntuación REBA Final</div>
                        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                            <span style={{ fontSize:52, fontWeight:900, color:riskPalette.fill, lineHeight:1 }}>{finalScore}</span>
                            <span style={{ fontSize:16, color:riskPalette.text, opacity:0.5 }}>/ 15</span>
                        </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:18, fontWeight:900, color:riskPalette.text, textTransform:'uppercase' }}>{risk?.level}</div>
                        <div style={{ fontSize:11, color:riskPalette.text, opacity:0.8, maxWidth:180, marginTop:4, lineHeight:1.4 }}>{risk?.action}</div>
                        {/* Action scale */}
                        <div style={{ display:'flex', gap:2, marginTop:8, borderRadius:99, overflow:'hidden', height:8, width:200, border:`1px solid ${riskPalette.border}` }}>
                            {[
                                { label:'1', w:1/15, c:'#94a3b8' },
                                { label:'2-3', w:2/15, c:'#10b981' },
                                { label:'4-7', w:4/15, c:'#f59e0b' },
                                { label:'8-10', w:3/15, c:'#f97316' },
                                { label:'11-15', w:5/15, c:'#ef4444' },
                            ].map(({ label, w, c }) => {
                                const ranges = { '1':[1,1], '2-3':[2,3], '4-7':[4,7], '8-10':[8,10], '11-15':[11,15] };
                                const [lo,hi] = ranges[label];
                                const isAct = finalScore >= lo && finalScore <= hi;
                                return (
                                    <div key={label} style={{ flex: w*100, background: c, opacity: isAct ? 1 : 0.25, transition:'opacity 0.5s', position:'relative' }}>
                                        {isAct && <div style={{ position:'absolute', top:-2, left:0, right:0, height:12, background:c, borderRadius:99, boxShadow:`0 0 6px ${c}` }} />}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', width:200, marginTop:2 }}>
                            {[1,3,7,10,15].map(n=> (
                                <span key={n} style={{ fontSize:7, color:riskPalette.text, opacity:0.5 }}>{n}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── FOOTER NOTE ──────────────────────────────────────── */}
                <div style={{ padding:'6px 10px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>
                    <p style={{ margin:0, fontSize:8, color:'#94a3b8', textAlign:'center', letterSpacing:'0.05em' }}>
                        NIVEL DE ACCIÓN: 1=No necesario · 2-3=Puede ser necesario · 4-7=Necesario · 8-10=Necesario pronto · 11-15=Actuación inmediata
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RebaFieldSheet;
