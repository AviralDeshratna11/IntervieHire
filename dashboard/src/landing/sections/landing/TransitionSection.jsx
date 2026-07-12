'use client';
import React from 'react';
import { FadeUpOnScroll } from '../../ui';

// ── TiltCard with spotlight ────────────────────────────────────────────────────
const TiltCard = ({ children, style = {}, className = '' }) => {
  const cardRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = React.useState({ x: '50%', y: '50%', opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({ x: ((y / rect.height) - 0.5) * -14, y: ((x / rect.width) - 0.5) * 14 });
    setSpotlight({ x: `${x}px`, y: `${y}px`, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: '50%', y: '50%', opacity: 0 });
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={className}
      style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition:'transform 0.12s cubic-bezier(0.25,1,0.5,1)', position:'relative', overflow:'hidden', ...style }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at ${spotlight.x} ${spotlight.y},rgba(255,255,255,0.07) 0%,transparent 60%)`, opacity:spotlight.opacity, transition:'opacity 0.3s ease', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'relative', zIndex:2 }}>{children}</div>
    </div>
  );
};

// ── Morphing AI/Human blob ────────────────────────────────────────────────────
const MorphBlob = ({ progress }) => {
  const chaosOpacity   = progress < 0.25 ? 1 : progress < 0.45 ? 1-(progress-0.25)/0.2 : 0;
  const clarityOpacity = progress < 0.55 ? 0 : progress < 0.75 ? (progress-0.55)/0.2    : 1;
  const humanOpacity   = progress < 0.4  ? 1 : progress < 0.65 ? 1-(progress-0.4)/0.25  : 0;
  const aiOpacity      = progress < 0.4  ? 0 : progress < 0.65 ? (progress-0.4)/0.25    : 1;
  const morphScaleY    = (progress<0.35||progress>0.65) ? 1 : 1-(1-Math.abs(progress-0.5)/0.15)*0.22;
  const morphScaleX    = (progress<0.35||progress>0.65) ? 1 : 1+(1-Math.abs(progress-0.5)/0.15)*0.18;
  const scanTop        = progress<0.3 ? -10 : progress<0.6 ? ((progress-0.3)/0.3)*110 : 110;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div className="morph-blob-inner" style={{ position:'relative', width:240, height:240, display:'flex', alignItems:'center', justifyContent:'center', transform:`scaleY(${morphScaleY}) scaleX(${morphScaleX})`, transition:'transform 0.1s ease-out, box-shadow 0.5s ease', filter:'brightness(1.15) saturate(1.25)', boxShadow:`${progress<0.5?'rgba(217,100,36,0.35)':'rgba(217,100,36,0.45)'} 0px 0px 80px 20px`, borderRadius:'50%' }}>

        {/* Chaos blob */}
        <div style={{ position:'absolute', inset:0, opacity:chaosOpacity*0.65, transition:'opacity 0.2s', pointerEvents:'none' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(255,107,53,0.75) 0%,rgba(217,100,36,0.6) 35%,rgba(139,92,246,0.4) 70%,transparent 100%)', borderRadius:'70% 30% 30% 70% / 60% 40% 60% 40%', filter:'blur(3px)', animation:'6s ease-in-out infinite evyMorph' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(217,100,36,0.5) 0%,rgba(139,92,246,0.3) 45%,transparent 100%)', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', filter:'blur(4px)', animation:'12s ease-in-out infinite reverse evyMorph' }} />
          <div style={{ position:'absolute', inset:9, background:'linear-gradient(135deg,rgba(255,255,255,0.4) 0%,rgba(217,100,36,0.2) 60%,transparent 100%)', borderRadius:'80% 20% 20% 80% / 20% 80% 20% 80%', filter:'blur(3.5px)', animation:'8s ease-in-out infinite reverse evyMorph', boxShadow:'rgba(255,255,255,0.3) 0px 0px 30px inset' }} />
        </div>

        {/* Clarity blob */}
        <div style={{ position:'absolute', inset:0, opacity:clarityOpacity*0.65, transition:'opacity 0.2s', pointerEvents:'none' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(217,100,36,0.75) 0%,rgba(34,211,238,0.6) 35%,rgba(16,185,129,0.4) 70%,transparent 100%)', borderRadius:'70% 30% 30% 70% / 60% 40% 60% 40%', filter:'blur(3px)', animation:'6s ease-in-out infinite evyMorph' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(34,211,238,0.5) 0%,rgba(16,185,129,0.3) 45%,transparent 100%)', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', filter:'blur(4px)', animation:'12s ease-in-out infinite reverse evyMorph' }} />
          <div style={{ position:'absolute', inset:9, background:'linear-gradient(135deg,rgba(255,255,255,0.4) 0%,rgba(217,100,36,0.2) 60%,transparent 100%)', borderRadius:'80% 20% 20% 80% / 20% 80% 20% 80%', filter:'blur(3.5px)', animation:'8s ease-in-out infinite reverse evyMorph', boxShadow:'rgba(255,255,255,0.3) 0px 0px 30px inset' }} />
        </div>

        {/* Human figure */}
        <div style={{ position:'absolute', inset:24, opacity:humanOpacity, transition:'opacity 0.1s', zIndex:10 }}>
          <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
            <circle cx="100" cy="60" r="32" stroke="#EEEEEE" strokeWidth="1.5" />
            <path d="M88 90 L88 108 M112 90 L112 108" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40 140 C40 120 70 110 100 110 C130 110 160 120 160 140 L160 220 L40 220 Z" stroke="#EEEEEE" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M40 140 L20 185" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            <path d="M160 140 L180 185" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          </svg>
          <div style={{ position:'absolute', left:-10, right:-10, top:`${scanTop}%`, height:2, background:'linear-gradient(90deg,transparent,#d96424,transparent)', boxShadow:'0 0 12px rgba(217,100,36,0.8)', opacity:(progress>0.3&&progress<0.6)?1:0, transition:'opacity 0.2s' }} />
        </div>

        {/* AI figure */}
        <div style={{ position:'absolute', inset:24, opacity:aiOpacity, transition:'opacity 0.1s', zIndex:10 }}>
          <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
            <path d="M100 28 L130 45 L130 79 L100 96 L70 79 L70 45 Z" stroke="#d96424" strokeWidth="1.5" />
            <path d="M100 28 L100 96 M70 45 L130 79 M130 45 L70 79" stroke="#d96424" strokeWidth="0.5" strokeOpacity="0.4" />
            <rect x="83" y="54" width="8" height="6" rx="1" fill="#d96424" fillOpacity="0.7" />
            <rect x="109" y="54" width="8" height="6" rx="1" fill="#d96424" fillOpacity="0.7" />
            <path d="M88 96 L88 116 M112 96 L112 116" stroke="#d96424" strokeWidth="1.5" />
            <path d="M50 150 L50 116 C50 116 70 110 100 110 C130 110 150 116 150 116 L150 150" stroke="#d96424" strokeWidth="1.5" />
            <rect x="50" y="150" width="100" height="70" rx="4" stroke="#d96424" strokeWidth="1.5" />
            <path d="M50 125 L22 160 L22 195" stroke="#d96424" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
            <path d="M150 125 L178 160 L178 195" stroke="#d96424" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
            <ellipse cx="100" cy="62" rx="45" ry="45" stroke="#d96424" strokeWidth="0.3" strokeOpacity="0.15" strokeDasharray="4 6" />
          </svg>
        </div>
      </div>

      {/* Label */}
      <div style={{ marginTop:20, height:20, position:'relative', width:300, textAlign:'center' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', transition:'opacity 0.3s', opacity:humanOpacity>0.5?1:0, color:'#888880', position:'absolute', width:'100%', left:0 }}>The Traditional Interviewer</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', transition:'opacity 0.3s', opacity:aiOpacity>0.5?1:0, color:'#d96424', position:'absolute', width:'100%', left:0 }}>Lina, Your AI Agent</div>
      </div>
    </div>
  );

};

export const TransitionSection = () => {
  const sectionRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [headingIn, setHeadingIn] = React.useState(false);
  const [shakeTrigger, setShakeTrigger] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);
  const [rightRevealed, setRightRevealed] = React.useState(false);
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  const prevProgress = React.useRef(0);

  React.useEffect(() => {
    setIsMobileDevice(window.innerWidth <= 768);
  }, []);

  // Pause animation after 100vh (once heading scrolls past viewport)
  React.useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = Math.min(sectionRef.current.offsetHeight - window.innerHeight, window.innerHeight);
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Incoming transition on heading
  React.useEffect(() => {
    if (!headingRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setHeadingIn(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(headingRef.current);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasEntered) { setInView(true); setHasEntered(true); }
    }, { threshold: 0.04 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasEntered]);

  React.useEffect(() => {
    if (!rightRevealed && progress >= 0.65) setRightRevealed(true);
  }, [progress, rightRevealed]);

  React.useEffect(() => {
    const crossed = (prevProgress.current < 0.5 && progress >= 0.5) || (prevProgress.current > 0.5 && progress <= 0.5);
    if (crossed) {
      setShakeTrigger(true);
      const t = setTimeout(() => setShakeTrigger(false), 400);
      return () => clearTimeout(t);
    }
    prevProgress.current = progress;
  }, [progress]);

  const cons = [
    '40 phone screens, 22 make it to round two, 6 worth the hiring manager\'s time',
    'Lost a strong candidate because scheduling took 5 days to align three calendars',
    'Same interviewer running the same script 40×/week, getting robotic by Friday',
    'Hiring manager says two candidates "felt identical" on paper — no real differentiation',
    'One no-show mid-loop, no backup, slot wasted',
    '"We need another recruiter" — but headcount budget says no',
  ];
  const pros = [
    'Lina interviews 200 candidates / role / week, 24/7, no calendar Tetris',
    'Every session flagged for proxy/cheating signals before it reaches your inbox',
    'First interview happens same-day — candidates don\'t go cold waiting',
    'Every submit ships with transcript + score, not just a recruiter\'s gut call',
    'Standardized rubric across every candidate — no panel-to-panel drift',
    'Shortlist-to-hire time drops because the top 20% surface themselves',
  ];

  return (
    <div style={{ position:'relative', zIndex:2, paddingTop:'clamp(40px, 5vw, 80px)', paddingBottom:'30px' }}>
      {/* Heading above the scroll container */}
      <div ref={headingRef} data-scroll data-scroll-speed="-0.1" style={{
        textAlign:'center', padding:'110px clamp(16px, 4vw, 48px) 0',
        position:'relative', zIndex:3,
        opacity:0, animation: headingIn ? 'titlePageReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0s forwards' : 'none',
      }}>
        <div style={{ display:'inline-block', padding:'5px 14px', borderRadius:999, border:'1px solid rgba(255,107,53,0.35)', background:'rgba(10,10,10,0.7)', backdropFilter:'blur(12px)', fontSize:11, fontFamily:'Outfit,sans-serif', color:'#DDDDDD', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>
          Every Recruiter's Tuesday
        </div>
        <h2 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(2rem,4.5vw,3.2rem)', fontWeight:700, color:'#EEEEEE', letterSpacing:'-0.02em', lineHeight:1.15, margin:0 }}>
          The Screening{' '}
          <span style={{ background:'linear-gradient(90deg,#d96424,#ba5520)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Bottleneck</span>
        </h2>
        <p style={{ fontFamily:'Outfit,sans-serif', fontSize:15, color:'#888880', margin:'24px 0 0 0' }}>
          What Actually Eats Your Hiring Week
        </p>
      </div>

      {/* Scroll container — heading NOT inside */}
      <div id="avatar-explainer" ref={sectionRef} style={{ height:'250vh', position:'relative', zIndex:2, margin:'0 0 30px' }}>
        <div data-scroll style={{ position:'sticky', top:0, height:'100vh', background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'200px clamp(32px, 6vw, 80px) clamp(120px, 12vw, 200px)', zIndex:2 }}>

          <style dangerouslySetInnerHTML={{__html:`
            .ts-grid { display: grid; grid-template-columns: 1fr 320px 1fr; gap: 60px; }
            @media (max-width: 768px) {
              .ts-grid {
                grid-template-columns: 1fr;
                gap: 24px !important;
                max-width: 440px;
                margin: 0 auto;
              }
              .ts-grid > div > div[style*="borderRadius"] {
                padding: 20px 16px !important;
                border-radius: 14px !important;
              }
              .ts-grid h3 {
                font-size: 18px !important;
                margin-bottom: 4px !important;
              }
              .ts-grid p {
                font-size: 12px !important;
                margin-bottom: 16px !important;
              }
              .ts-grid ul {
                gap: 10px !important;
              }
              .ts-grid li {
                gap: 8px !important;
              }
              .ts-grid li span {
                font-size: 12.5px !important;
              }
              .morph-blob-inner {
                width: 120px !important;
                height: 120px !important;
              }
            }
            @keyframes rightBoomReveal {
              0%   { opacity:0; transform:scale(0.1) translateX(40px); filter:brightness(5) blur(20px); }
              40%  { opacity:1; transform:scale(1.25) translateX(-6px); filter:brightness(1.8) blur(4px); }
              65%  { transform:scale(0.92) translateX(2px); filter:brightness(1) blur(0); }
              82%  { transform:scale(1.06) translateX(-1px); }
              100% { opacity:1; transform:scale(1) translateX(0); filter:brightness(1) blur(0); }
            }
          `}} />

          {/* 3-column grid — no heading inside */}
          <div className="ts-grid" style={{ display:'grid', gridTemplateColumns:'1fr 320px 1fr', gap:'clamp(24px, 4vw, 60px)', width:'100%', maxWidth:1200, alignItems:'center', position:'relative', zIndex:10 }}>

            {/* LEFT CARD */}
            <div data-scroll style={{ minHeight:'clamp(500px, 60vh, 700px)', opacity:0, animation: inView ? 'leftBoomReveal 1s cubic-bezier(0.34,1.56,0.64,1) 0.5s forwards' : 'none' }}>
              <TiltCard style={{ background:'rgba(255,107,53,0.01)', border:'1.5px solid rgba(255,107,53,0.3)', borderRadius:20, padding:'clamp(24px, 3vw, 40px) clamp(20px, 3vw, 32px)', boxShadow:'0 0 25px rgba(255,107,53,0.08), 0 15px 30px rgba(0,0,0,0.4)' }}>
                <h3 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(20px, 2.5vw, 26px)', fontWeight:700, color:'#DDDDDD', marginBottom:8, letterSpacing:'-0.01em', textAlign:'center' }}>A typical hiring week</h3>
                <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#666660', marginBottom:28 }}>Where your recruiter hours actually go</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:16 }}>
                  {cons.map((item, idx) => (
                    <li key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <span style={{ color:'#DDDDDD', fontWeight:'bold', fontSize:15, flexShrink:0 }}>✕</span>
                      <span style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#888880', lineHeight:1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </div>

            {/* CENTRE */}
            <FadeUpOnScroll delay={0.1} y={30} threshold={0.6}>
              <div data-scroll className={shakeTrigger ? 'morph-shake' : ''}>
                <MorphBlob progress={progress} />
              </div>
            </FadeUpOnScroll>

            {/* RIGHT CARD — boom in after human → AI morph */}
            <div data-scroll style={{ minHeight:'clamp(500px, 60vh, 700px)', opacity:0, animation: rightRevealed ? 'rightBoomReveal 1s cubic-bezier(0.34,1.56,0.64,1) 0s forwards' : 'none' }}>
              <TiltCard
                className={progress > 0.75 ? 'pulse-glow' : ''}
                style={{ background:'rgba(217,100,36,0.02)', border:'1.5px solid rgba(217,100,36,0.3)', borderRadius:20, padding:'clamp(24px, 3vw, 40px) clamp(20px, 3vw, 32px)', boxShadow:'0 0 25px rgba(217,100,36,0.08), 0 15px 30px rgba(0,0,0,0.4)', pointerEvents:rightRevealed?'auto':'none' }}
              >
                <h3 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(20px, 2.5vw, 26px)', fontWeight:700, color:'#d96424', marginBottom:8, letterSpacing:'-0.01em', textAlign:'center' }}>A week with Lina running screens</h3>
                <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#666660', marginBottom:28 }}>What automated interviews actually ship</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:16 }}>
                  {pros.map((item, idx) => (
                    <li key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <span style={{ color:'#d96424', fontWeight:'bold', fontSize:15, flexShrink:0 }}>✓</span>
                      <span style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#EEEEEE', lineHeight:1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', opacity:progress<0.05?0.5:0, transition:'opacity 0.4s', color:'#555550', fontFamily:'Outfit,sans-serif', fontSize:12, letterSpacing:'0.1em', zIndex:10 }}>
            SCROLL
          </div>

        </div>
      </div>
    </div>
  );
};
