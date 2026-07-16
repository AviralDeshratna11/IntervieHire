'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks';
import { THEME, CHAOS_PAIN_PILLS, CHAOS_CARDS_DATA, CHAOS_CARD_ENTRY, CHAOS_PILL_POSITIONS } from '../../constants';
const THEME_LOCAL = {
  ...THEME,
  teal:  THEME.card,
  faint: THEME.faint,
};
const T = THEME_LOCAL;
function makeParams(seed) {
  const r = (n) => ((seed * 9301 + n * 49297) % 233280) / 233280;
  return { ax:3+r(1)*5, ay:2+r(2)*4, ar:0.4+r(3)*0.9, fr:0.5+r(4)*0.7, ph:r(5)*Math.PI*2 };
}

// Handles both: 1) Staggered Spring/Burst Entry, and 2) Live Sine Wave Float
function FloatingAndBurstItem({ children, position, baseRotate, seed, animIn, delay = 0, type = 'card' }) {
  const ref   = useRef(null);
  const frame = useRef(null);
  const p     = useRef(makeParams(seed));

  useEffect(() => {
    const { ax, ay, ar, fr, ph } = p.current;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const t = ((ts - t0) / 1000) * fr * Math.PI * 2;
      if (ref.current) {
        ref.current.style.transform =
          `rotate(${ar * Math.sin(t * 0.83 + ph + 2)}deg) translate(${ax * Math.sin(t + ph)}px,${ay * Math.sin(t * 1.37 + ph + 1)}px)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    if (animIn) {
      frame.current = requestAnimationFrame(tick);
    }
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [animIn]);

  const pos = {};
  ['top','left','right','bottom'].forEach(k => { if (position[k] != null) pos[k] = position[k]; });

  const entryStyle = animIn ? {
    opacity: 1,
    transform: `rotate(${baseRotate}deg) translate(0px,0px) scale(1)`,
    transition: `opacity 2.8s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 3.0s ${delay}s cubic-bezier(0.25,1,0.3,1)`,
  } : {
    opacity: 0,
    transform: `rotate(${position.fromR || 0}deg) translate(${position.fromX || '0px'}, ${position.fromY || '0px'}) scale(${type === 'pill' ? 0.3 : 0.4})`,
    transition: 'none',
  };

  return (
    <div style={{ position:'absolute', willChange:'transform', transformOrigin:'center', ...pos, ...entryStyle, zIndex: type === 'pill' ? 4 : 3 }}>
      <div ref={ref} style={{ willChange:'transform' }}>
        {children}
      </div>
    </div>
  );
}

const cs = {
  card:   { background:'rgba(255,255,255,0.06)', border:`1px solid ${THEME.border}`, borderRadius:14, padding:'16px 18px', width:230, boxShadow:'0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(45,212,191,0.04)' },
  label:  { fontFamily:'Outfit, sans-serif', fontSize:10, fontWeight:600, letterSpacing:'0.1em', color:THEME.gold, textTransform:'uppercase', marginBottom:10 },
  name:   { fontFamily:'Outfit, sans-serif', fontSize:13, fontWeight:600, color:THEME.white, marginBottom:4 },
  sub:    { fontFamily:'Outfit, sans-serif', fontSize:11.5, color:THEME.muted, lineHeight:1.4 },
  divider:{ height:1, background:'rgba(45,212,191,0.08)', margin:'10px 0' },
};

const ScoreCard   = ({ card }) => (
  <div style={cs.card}>
    <div style={cs.label}>{card.label}</div>
    <div style={cs.name}>{card.name}</div>
    <div style={{ fontFamily:'Outfit, sans-serif', fontSize:26, fontWeight:700, color:card.scoreColor, margin:'8px 0' }}>{card.score}</div>
    <div style={cs.divider}/>
    <div style={{ ...cs.sub, marginBottom:4 }}>{card.note1}</div>
    <div style={cs.sub}>{card.note2}</div>
  </div>
);
const StatusCard  = ({ card }) => (
  <div style={cs.card}>
    <div style={cs.label}>{card.label}</div>
    <div style={cs.name}>{card.name}</div>
    <div style={{ display:'inline-block', background:'rgba(232,53,109,0.12)', border:'1px solid rgba(232,53,109,0.3)', borderRadius:6, padding:'8px', margin:'8px 0' }}>
      <span style={{ fontFamily:'Outfit, sans-serif', fontSize:11, fontWeight:700, color:THEME.pink, letterSpacing:'0.06em' }}>{card.status}</span>
    </div>
    <div style={cs.divider}/>
    <div style={{ display:'flex', justifyContent:'space-between' }}>
      <span style={cs.sub}>{card.reason}</span>
      <span style={{ ...cs.sub, color:'#555550' }}>{card.time}</span>
    </div>
  </div>
);
const CalendarCard = ({ card }) => (
  <div style={cs.card}>
    <div style={cs.label}>{card.label}</div>
    <div style={{ ...cs.name, marginBottom:10 }}>{card.candidate}</div>
    {card.slots.map((s,i) => (
      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <span style={{ ...cs.sub, color:'#666660' }}>{s.day}</span>
        <span style={{ fontSize:10, fontFamily:'Outfit, sans-serif', fontWeight:600, borderRadius:4, padding:'2px 7px',
          color: s.state==='declined' ? THEME.pink : THEME.gold,
          background: s.state==='declined' ? 'rgba(232,53,109,0.1)' : 'rgba(45,212,191,0.1)',
          border:`1px solid ${s.state==='declined'?'rgba(232,53,109,0.3)':'rgba(45,212,191,0.3)'}`,
        }}>{s.state.toUpperCase()}</span>
      </div>
    ))}
  </div>
);
const CostCard = ({ card }) => (
  <div style={cs.card}>
    <div style={cs.label}>{card.label}</div>
    <div style={cs.name}>{card.line}</div>
    <div style={{ display:'flex', gap:16, margin:'10px 0' }}>
      <div>
        <div style={{ fontFamily:'Outfit, sans-serif', fontSize:22, fontWeight:700, color:THEME.gold }}>{card.hrs}</div>
        <div style={cs.sub}>{card.hrsLabel}</div>
      </div>
      <div style={{ width:1, background:'rgba(45,212,191,0.08)' }}/>
      <div>
        <div style={{ fontFamily:'Outfit, sans-serif', fontSize:22, fontWeight:700, color:THEME.white }}>{card.cost}</div>
        <div style={cs.sub}>{card.costLabel}</div>
      </div>
    </div>
    <div style={cs.divider}/>
    <div style={{ ...cs.sub, color:THEME.pink }}>⚠ {card.flag}</div>
  </div>
);

const RENDERERS = { score:ScoreCard, status:StatusCard, calendar:CalendarCard, cost:CostCard };

// ── Headline ───────────────────────────────────────────────────────────────────
function AnimatedHeadline({ animIn }) {
  const line1 = 'Every Open Role Costs You.';
  const line2 = 'Every Day You Wait Costs More.';

  const lineStyle = (delay) => ({
    opacity: animIn ? 1 : 0,
    transform: animIn ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
    filter: animIn ? 'blur(0px)' : 'blur(6px)',
    transition: animIn 
      ? `opacity 2.5s ${delay}s cubic-bezier(0.16, 1, 0.3, 1), transform 2.5s ${delay}s cubic-bezier(0.16, 1, 0.3, 1), filter 2.5s ${delay}s`
      : 'none',
  });

  return (
    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:10, textAlign:'center', pointerEvents:'none', width:'100%', padding:'0 clamp(12px,4vw,20px)' }}>
      {/* Glowing backdrop blur behind headline */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:520, height:200,
        background:'radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, transparent 70%)',
        filter:'blur(20px)',
        pointerEvents:'none',
        opacity: animIn ? 1 : 0,
        transition:'opacity 2.5s 0.1s',
      }}/>

      <h2 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(1.3rem, 2.8vw, 2.2rem)', fontWeight:700, color:THEME.white, letterSpacing:'-0.03em', lineHeight:1.35, margin:0 }}>
        <div style={lineStyle(0.35)}>{line1}</div>
        <div style={{...lineStyle(0.85), background:'linear-gradient(135deg,#2dd4bf,#64a0dc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{line2}</div>
      </h2>


    </div>
  );
}

// ── Mobile fallback: the desktop layout scatters fixed-position cards/pills
// across a 1400px canvas via % offsets, which overlaps and clips on narrow
// viewports. Below 768px we render the same content as a simple fade-up stack.
const MobileChaosStack = ({ animIn }) => (
  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(28px, 6vw, 40px)' }}>
    <h2 style={{
      fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 6vw, 1.8rem)', fontWeight: 700,
      color: THEME.white, letterSpacing: '-0.02em', lineHeight: 1.35, margin: 0, textAlign: 'center',
      padding: '0 clamp(12px, 4vw, 20px)',
      opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
    }}>
      Every Open Role Costs You.<br />
      <span style={{ background: 'linear-gradient(135deg,#2dd4bf,#64a0dc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Every Day You Wait Costs More.</span>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 340, alignItems: 'center' }}>
      {CHAOS_CARDS_DATA.map((card, i) => {
        const Renderer = RENDERERS[card.type];
        return (
          <div key={`mc-${i}`} style={{
            opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.6s ${0.08 * i}s cubic-bezier(0.16,1,0.3,1), transform 0.6s ${0.08 * i}s cubic-bezier(0.16,1,0.3,1)`,
            width: '100%',
          }}>
            <Renderer card={card} />
          </div>
        );
      })}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 380 }}>
      {CHAOS_PAIN_PILLS.map((pill, i) => (
        <div key={`mp-${i}`} style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 12.5, fontWeight: 500, color: THEME.white,
          background: 'rgba(15,13,7,0.85)', border: '1px solid rgba(45,212,191,0.18)', borderRadius: 99,
          padding: '8px 16px', whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.6s ${0.4 + 0.06 * i}s cubic-bezier(0.16,1,0.3,1), transform 0.6s ${0.4 + 0.06 * i}s cubic-bezier(0.16,1,0.3,1)`,
        }}>
          <span style={{ color: THEME.gold, fontWeight: 700, marginRight: 6 }}>{pill.num}</span>{pill.label}
        </div>
      ))}
    </div>
  </div>
);

// ── Section ───────────────────────────────────────────────────────────────────
export const HiringChaosSection = () => {
  const sectionRef = useRef(null);
  const [animIn, setAnimIn] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimIn(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Section ─────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} data-scroll style={{ background:THEME.bg, minHeight: isMobile ? 'auto' : '100vh', height:'auto', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'clamp(20px, 2vw, 30px)', padding:'clamp(60px, 6vw, 80px) clamp(8px, 2vw, 24px) clamp(40px, 6vw, 80px)' }}>
      {/* Glowing cut-line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191,0.55), 0 4px 80px rgba(45,212,191,0.18)',
        zIndex: 20, pointerEvents: 'none',
      }} />
      {/* Radial glows */}
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:900, height:600, background:'radial-gradient(ellipse, rgba(45,212,191,0.12) 0%, transparent 65%)', pointerEvents:'none', zIndex:1 }}/>
      <div style={{ position:'absolute', bottom:'20%', right:'10%', width:600, height:400, background:'radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 65%)', pointerEvents:'none', zIndex:1 }}/>
      <div style={{ position:'absolute', top:'15%', left:'5%', width:400, height:400, background:'radial-gradient(ellipse, rgba(45,212,191,0.05) 0%, transparent 65%)', pointerEvents:'none', zIndex:1 }}/>

      {/* Explosion shockwave ring — fires once on entry (desktop only) */}
      {!isMobile && (
        <div style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width: animIn ? 1800 : 0, height: animIn ? 1800 : 0,
          borderRadius:'50%',
          border:`1px solid rgba(45,212,191,${animIn ? 0 : 0.35})`,
          opacity: animIn ? 0 : 1,
          transition: animIn ? 'width 3.5s cubic-bezier(0.1,0.8,0.2,1), height 3.5s cubic-bezier(0.1,0.8,0.2,1), opacity 3.5s cubic-bezier(0.1,0.8,0.2,1), border-color 3.5s' : 'none',
          pointerEvents:'none', zIndex:5,
        }}/>
      )}

      {isMobile ? (
        <div style={{ position: 'relative', width: '100%', zIndex: 2 }}>
          <MobileChaosStack animIn={animIn} />
        </div>
      ) : (
      <div style={{ position:'relative', width:'100%', maxWidth:1400, minHeight:'clamp(500px, 100vh, 900px)', height:'auto' }}>

        {/* Cards — burst in + float */}
        {CHAOS_CARDS_DATA.map((card, i) => {
          const Renderer = RENDERERS[card.type];
          const entry    = CHAOS_CARD_ENTRY[i];
          return (
            <FloatingAndBurstItem key={`c-${i}`} position={entry} baseRotate={entry.rotate} seed={i*7+3} animIn={animIn} delay={i*0.25} type="card">
              <Renderer card={card}/>
            </FloatingAndBurstItem>
          );
        })}

        {/* Pills — burst in + float */}
        {CHAOS_PAIN_PILLS.map((pill, i) => {
          const pp = CHAOS_PILL_POSITIONS[i];
          return (
            <FloatingAndBurstItem key={`p-${i}`} position={pp} baseRotate={0} seed={i*11+1} animIn={animIn} delay={0.6+i*0.18} type="pill">
              <div style={{ fontFamily:'Outfit, sans-serif', fontSize:13.5, fontWeight:500, color:THEME.white,
                background:'rgba(15,13,7,0.85)', border:'1px solid rgba(45,212,191,0.18)', borderRadius:99,
                padding:'10px 22px', backdropFilter:'blur(12px)', whiteSpace:'nowrap',
                boxShadow:'0 4px 20px rgba(0,0,0,0.5), 0 0 20px rgba(45,212,191,0.04)',
              }}>
                <span style={{ color:THEME.gold, fontWeight:700, marginRight:6 }}>{pill.num}</span>{pill.label}
              </div>
            </FloatingAndBurstItem>
          );
        })}

        {/* Headline — cinematic word-split */}
        <AnimatedHeadline animIn={animIn}/>

      </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes hcRingPulse {
          0%   { transform:translate(-50%,-50%) scale(0); opacity:0.6; }
          100% { transform:translate(-50%,-50%) scale(1); opacity:0; }
        }
      `}}/>
    </section>
  );
};

export default HiringChaosSection;
