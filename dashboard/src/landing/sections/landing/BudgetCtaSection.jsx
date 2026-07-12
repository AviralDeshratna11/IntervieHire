'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { COLORS, BUDGET_CTA_STATS } from '../../constants';

const T = {
  gold:  COLORS.gold,
  teal:  COLORS.darkAlt,
  pink:  COLORS.gold,
  cream: '#F0ECD8',
  muted: '#888880',
  bg:    COLORS.dark
};

const fade = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
});

export const BudgetCtaSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);


  const numStyle = { fontFamily:'Outfit, sans-serif', fontSize:'clamp(28px,3.5vw,40px)', fontWeight:700, color:T.gold, lineHeight:1.1 };
  const suffixStyle = { fontFamily:'Outfit, sans-serif', fontSize:'clamp(14px,1.8vw,20px)', fontWeight:400, color:T.gold, opacity:0.6 };

  return (
    <section ref={ref} data-scroll style={{ background:T.bg, padding:'90px clamp(16px,4vw,32px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:'radial-gradient(ellipse, rgba(217,100,36,0.04) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:900, margin:'0 auto', position:'relative', zIndex:2, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>

        {/* ── Eyebrow ── */}
        <div style={{ fontFamily:'Outfit, sans-serif', fontSize:12, fontWeight:600, letterSpacing:'0.22em', color:T.gold, marginBottom:16, ...fade(visible,0) }}>
          — YOUR HIRING BUDGET, RECALCULATED —
        </div>

        {/* ── Heading ── */}
        <h2 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(1.6rem,3.8vw,2.8rem)', fontWeight:700, color:T.cream, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 8px', ...fade(visible,0.1) }}>
          What Lina costs you now.
        </h2>
        <div style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(1.4rem,3.2vw,2.2rem)', fontWeight:600, color:T.pink, letterSpacing:'-0.02em', lineHeight:1.25, marginBottom:24, ...fade(visible,0.2) }}>
          Spoiler: less than one recruiter&apos;s salary.
        </div>

        {/* ── Subheading ── */}
        <p style={{ fontFamily:'Outfit, sans-serif', fontSize:15, color:T.muted, lineHeight:1.6, margin:'0 0 36px', maxWidth:560, ...fade(visible,0.25) }}>
          Plug in your team size and current screening costs — watch the number drop.
        </p>

        {/* ── 3-Column Stat Bar ── */}
        <div style={{
          display:'flex', alignItems:'center',
          border:'1px solid rgba(217,100,36,0.18)', borderRadius:20,
          padding:'clamp(16px,2vw,24px) clamp(20px,3vw,36px)',
          background:'linear-gradient(180deg, rgba(217,100,36,0.06) 0%, transparent 100%)',
          width:'100%', maxWidth:700, marginBottom:48,
          ...fade(visible,0.3),
        }}>
          {BUDGET_CTA_STATS.map((s,i) => (
            <React.Fragment key={i}>
              <div style={{ flex:1, textAlign:'center', padding:'4px 0' }}>
                <div style={numStyle}>
                  {s.num}<span style={suffixStyle}>{s.suffix}</span>
                </div>
                <div style={{ fontFamily:'Outfit, sans-serif', fontSize:12, color:T.muted, marginTop:4, letterSpacing:'0.02em' }}>
                  {s.label}
                </div>
              </div>
              {i < BUDGET_CTA_STATS.length - 1 && (
                <div style={{ width:1, height:40, background:'rgba(217,100,36,0.12)', margin:'0 clamp(8px,1.5vw,20px)' }}/>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Button ── */}
        <Link href="/pricing" style={{
          display:'inline-flex', alignItems:'center', gap:8,
          fontFamily:'Outfit, sans-serif', fontSize:13, fontWeight:600, letterSpacing:'0.04em',
          color:T.gold, background:'rgba(217,100,36,0.08)', border:'1px solid rgba(217,100,36,0.25)',
          borderRadius:99, padding:'14px 32px', textDecoration:'none',
          transition:'background 0.3s, border-color 0.3s',
          ...fade(visible,0.4),
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(217,100,36,0.15)'; e.currentTarget.style.borderColor='rgba(217,100,36,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(217,100,36,0.08)'; e.currentTarget.style.borderColor='rgba(217,100,36,0.25)'; }}
        >
          See full pricing breakdown &rarr;
        </Link>

      </div>
    </section>
  );
};

export default BudgetCtaSection;
