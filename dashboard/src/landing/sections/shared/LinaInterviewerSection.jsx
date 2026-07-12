'use client';
import React, { useState, useEffect } from 'react';
import { THEME, LINA_FEATURES, LINA_SIGNALS } from '../../constants';

const T = THEME;

export function LinaInterviewerSection() {
  const [activeSignal, setActiveSignal] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveSignal(i => (i + 1) % LINA_SIGNALS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position:'relative', width:'100%', background:T.bg, padding:'clamp(30px,4vw,60px) clamp(16px,4vw,48px)', overflow:'hidden' }}>
      <div style={{ position:'relative', margin:'0 auto', maxWidth:1100 }}>

        {/* Eyebrow */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:20 }}>
          <span style={{ width:40, height:1, background:'rgba(217,100,36,0.5)' }} />
          <span style={{ fontFamily:'Outfit, sans-serif', fontSize:11, fontWeight:700, letterSpacing:'0.28em', color:T.gold }}>THE INTERVIEWER</span>
          <span style={{ width:40, height:1, background:'rgba(217,100,36,0.5)' }} />
        </div>

        <h2 style={{ fontFamily:'Outfit, sans-serif', fontWeight:900, color:T.white, fontSize:'clamp(2.2rem,4vw,3.6rem)', lineHeight:1.08, letterSpacing:'-0.02em', textAlign:'center', margin:0 }}>
          Meet Lina.
        </h2>
        <p style={{ fontFamily:'Outfit, sans-serif', fontWeight:900, fontSize:'clamp(1.6rem,3vw,2.6rem)', lineHeight:1.15, letterSpacing:'-0.02em', textAlign:'center', color:T.pink, margin:'12px 0 0' }}>
          She interviews so you don&apos;t have to.
        </p>

        <p style={{ fontFamily:'Outfit,sans-serif', fontSize:'clamp(14px,1.6vw,17px)', lineHeight:1.65, textAlign:'center', color:T.muted, maxWidth:600, margin:'24px auto 0' }}>
          Lina runs natural, conversational interviews — not rigid scripts. She asks follow-up questions based on what candidates actually say, scores them on resume and live response together, and gets sharper every time your team marks a hire or a pass.
        </p>

        <div className="lina-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:'clamp(40px,5vw,80px)', marginTop:64, alignItems:'start' }}>
          {/* Left — features */}
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:24 }}>
            {LINA_FEATURES.map((f,i) => (
              <li key={i} style={{ display:'flex', gap:14 }}>
                <span style={{ flexShrink:0, width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)' }}>
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                    <path d="M1 5L4.5 8.5L12 1" stroke={T.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontFamily:'Outfit,sans-serif', fontSize:'clamp(13px,1.4vw,15px)', lineHeight:1.6, color:T.muted, margin:0 }}>
                  <span style={{ fontWeight:600, color:T.white }}>{f.label}</span>
                  <span style={{ color:T.muted }}> — {f.body}</span>
                </p>
              </li>
            ))}
          </ul>

          {/* Right — live interview mock card */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{
              width:'100%', maxWidth:400, border:'1px solid rgba(255,255,255,0.08)', borderRadius:16,
              background:T.card, padding:'clamp(20px,3vw,28px)',
              boxShadow:'0 30px 60px -20px rgba(0,0,0,0.7)',
            }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:T.white, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Outfit, sans-serif', fontSize:14, fontWeight:700, color:T.bg }}>L</div>
                  <div>
                    <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, fontWeight:600, color:T.white, margin:0 }}>Lina</p>
                    <p style={{ fontFamily:'Outfit,sans-serif', fontSize:12, color:T.muted, margin:0 }}>AI Interviewer &middot; Live</p>
                  </div>
                </div>
                <span style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.04)', borderRadius:99, padding:'4px 10px', fontFamily:'Outfit, sans-serif', fontSize:10, fontWeight:600, letterSpacing:'0.06em', color:T.white }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:T.pink, animation:'linaPulse 1.5s infinite' }} />
                  RECORDING
                </span>
              </div>

              {/* Chat bubbles */}
              <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ background:'rgba(0,0,0,0.6)', borderRadius:10, padding:14 }}>
                  <p style={{ fontFamily:'Outfit, sans-serif', fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', color:T.muted, margin:'0 0 4px' }}>Lina asks</p>
                  <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'rgba(245,240,232,0.85)', margin:0 }}>&ldquo;You mentioned scaling that team to 40 — what broke first?&rdquo;</p>
                </div>
                <div style={{ background:'rgba(0,0,0,0.35)', borderRadius:10, padding:14 }}>
                  <p style={{ fontFamily:'Outfit, sans-serif', fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', color:T.muted, margin:'0 0 4px' }}>Follow-up queued</p>
                  <p style={{ fontFamily:'Outfit,sans-serif', fontSize:13, color:'rgba(136,136,128,0.6)', margin:0 }}>Probing deeper on ownership vs. delegation &hellip;</p>
                </div>
              </div>

              {/* Signals */}
              <div style={{ marginTop:20, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:16, display:'flex', flexDirection:'column', gap:10 }}>
                {LINA_SIGNALS.map((s,i) => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'Outfit,sans-serif', fontSize:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:T.muted }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background: i === activeSignal ? T.white : '#3A3A38', transition:'background 0.3s' }} />
                      {s.label}
                    </span>
                    <span style={{ fontWeight:500, color:'rgba(245,240,232,0.7)' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display:'flex', justifyContent:'center', marginTop:'clamp(40px,5vw,64px)' }}>
          <button style={{
            display:'inline-flex', alignItems:'center', gap:8,
            fontFamily:'Outfit, sans-serif', fontSize:13, fontWeight:700, letterSpacing:'0.04em',
            color:T.gold, background:'rgba(217,100,36,0.06)', border:'1px solid rgba(217,100,36,0.35)',
            borderRadius:99, padding:'14px 28px', cursor:'pointer',
            transition:'background 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(217,100,36,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(217,100,36,0.06)'}
          >
            Watch Lina interview live
            <span style={{ transition:'transform 0.2s' }} className="lina-arrow">→</span>
          </button>
        </div>

      </div>
      <style>{`
        @keyframes linaPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        button:hover .lina-arrow { transform:translateX(3px); }
        @media (min-width: 1024px) { .lina-grid { grid-template-columns: 1.05fr 0.95fr !important; } }
      `}</style>
    </section>
  );
}
