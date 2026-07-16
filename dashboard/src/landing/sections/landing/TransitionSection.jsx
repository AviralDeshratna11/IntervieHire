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
      <div className="morph-blob-inner" style={{ position:'relative', width:240, height:240, display:'flex', alignItems:'center', justifyContent:'center', transform:`scaleY(${morphScaleY}) scaleX(${morphScaleX})`, transition:'transform 0.1s ease-out, box-shadow 0.5s ease', filter:'brightness(1.15) saturate(1.25)', boxShadow:`${progress<0.5?'rgba(45,212,191,0.35) 0px 0px 80px 20px':'rgba(45,212,191,0.12) 0px 0px 40px 10px'}`, borderRadius:'50%' }}>

        {/* Chaos blob */}
        <div style={{ position:'absolute', inset:0, opacity:chaosOpacity*0.65, transition:'opacity 0.2s', pointerEvents:'none' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(45,212,191,0.75) 0%,rgba(45,212,191,0.6) 35%,rgba(139,92,246,0.4) 70%,transparent 100%)', borderRadius:'70% 30% 30% 70% / 60% 40% 60% 40%', filter:'blur(3px)', animation:'6s ease-in-out infinite evyMorph' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(45,212,191,0.5) 0%,rgba(139,92,246,0.3) 45%,transparent 100%)', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', filter:'blur(4px)', animation:'12s ease-in-out infinite reverse evyMorph' }} />
          <div style={{ position:'absolute', inset:9, background:'linear-gradient(135deg,rgba(255,255,255,0.4) 0%,rgba(45,212,191,0.2) 60%,transparent 100%)', borderRadius:'80% 20% 20% 80% / 20% 80% 20% 80%', filter:'blur(3.5px)', animation:'8s ease-in-out infinite reverse evyMorph', boxShadow:'rgba(255,255,255,0.3) 0px 0px 30px inset' }} />
        </div>

        {/* Clarity blob — Orange/Purple theme to match chaos blob animations, with lower opacity */}
        <div style={{ position:'absolute', inset:0, opacity:clarityOpacity*0.5, transition:'opacity 0.2s', pointerEvents:'none' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(45,212,191,0.75) 0%,rgba(45,212,191,0.6) 35%,rgba(139,92,246,0.4) 70%,transparent 100%)', borderRadius:'70% 30% 30% 70% / 60% 40% 60% 40%', filter:'blur(3px)', animation:'6s ease-in-out infinite evyMorph' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle,rgba(45,212,191,0.5) 0%,rgba(139,92,246,0.3) 45%,transparent 100%)', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', filter:'blur(4px)', animation:'12s ease-in-out infinite reverse evyMorph' }} />
          <div style={{ position:'absolute', inset:9, background:'linear-gradient(135deg,rgba(255,255,255,0.4) 0%,rgba(45,212,191,0.2) 60%,transparent 100%)', borderRadius:'80% 20% 20% 80% / 20% 80% 20% 80%', filter:'blur(3.5px)', animation:'8s ease-in-out infinite reverse evyMorph', boxShadow:'rgba(255,255,255,0.3) 0px 0px 30px inset' }} />
        </div>

        {/* Human figure — SVG outline */}
        <div style={{ position:'absolute', inset:24, opacity:humanOpacity, transition:'opacity 0.15s', zIndex:10 }}>
          <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
            <circle cx="100" cy="60" r="32" stroke="#EEEEEE" strokeWidth="1.5" />
            <path d="M88 90 L88 108 M112 90 L112 108" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40 140 C40 120 70 110 100 110 C130 110 160 120 160 140 L160 220 L40 220 Z" stroke="#EEEEEE" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M40 140 L20 185" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            <path d="M160 140 L180 185" stroke="#EEEEEE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          </svg>
          <div style={{ position:'absolute', left:-10, right:-10, top:`${scanTop}%`, height:2, background:'linear-gradient(90deg,transparent,#2dd4bf,transparent)', boxShadow:'0 0 12px rgba(45,212,191,0.8)', opacity:(progress>0.3&&progress<0.6)?1:0, transition:'opacity 0.2s' }} />
        </div>

        {/* AI — real avatar photo in glowing circle */}
        <div style={{
          position:'absolute', inset:0, zIndex:10,
          opacity: aiOpacity,
          transform: `scale(${0.6 + aiOpacity * 0.4})`,
          transition:'opacity 0.18s ease-out, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {/* Outer glow ring — animates when fully visible */}
          <div style={{
            position:'absolute', inset:-6,
            borderRadius:'50%',
            background:'transparent',
            border:`2px solid rgba(45,212,191,${aiOpacity * 0.5})`,
            boxShadow:`0 0 ${12 + aiOpacity*20}px ${4 + aiOpacity*8}px rgba(45,212,191,${aiOpacity*0.2}), inset 0 0 10px rgba(45,212,191,0.05)`,
            transition:'box-shadow 0.4s ease, border-color 0.4s ease',
          }} />
          {/* Second decorative ring */}
          <div style={{
            position:'absolute', inset:-14,
            borderRadius:'50%',
            border:`1px dashed rgba(45,212,191,${aiOpacity * 0.25})`,
            animation: aiOpacity > 0.5 ? 'spin-slow 8s linear infinite' : 'none',
          }} />
          {/* The photo circle */}
          <div style={{
            width:'100%', height:'100%',
            borderRadius:'50%',
            overflow:'hidden',
            position:'relative',
            border:'3px solid rgba(45,212,191,0.5)',
            boxShadow:'0 0 0 1px rgba(255,255,255,0.06) inset',
          }}>
            <img
              src="/lina-avatar.png"
              alt="Lina — AI Interviewer"
              style={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
                objectPosition:'center top',
                display:'block',
                filter: `brightness(${0.85 + aiOpacity * 0.2}) saturate(1.1)`,
                transition:'filter 0.3s ease',
              }}
            />
            {/* Scan line overlay during morph */}
            <div style={{ position:'absolute', left:0, right:0, top:`${scanTop}%`, height:2, background:'linear-gradient(90deg,transparent,rgba(45,212,191,0.9),transparent)', boxShadow:'0 0 12px rgba(45,212,191,0.8)', opacity:(progress>0.3&&progress<0.75)?1:0, transition:'opacity 0.2s', pointerEvents:'none' }} />
            {/* Subtle orange tint overlay */}
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 0%, rgba(45,212,191,0.12) 0%, transparent 60%)', pointerEvents:'none' }} />
          </div>
        </div>

      </div>

      {/* Spin-slow keyframe */}
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />

      {/* Label */}
      <div style={{ marginTop:20, height:20, position:'relative', width:300, textAlign:'center' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', transition:'opacity 0.3s', opacity:humanOpacity>0.5?1:0, color:'#888880', position:'absolute', width:'100%', left:0 }}>The Traditional Interviewer</div>
        <div className="lina-shine" style={{ fontFamily:'Outfit,sans-serif', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', transition:'opacity 0.3s', opacity:aiOpacity>0.5?1:0, background:'linear-gradient(135deg, #2dd4bf 0%, #2dd4bf 35%, #7df2e8 45%, #96f7ef 50%, #7df2e8 55%, #2dd4bf 65%, #2dd4bf 100%)', backgroundSize:'300% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', position:'absolute', width:'100%', left:0 }}>Lina, Your AI Agent</div>
      </div>
    </div>
  );

};

export const TransitionSection = () => {
  const sectionRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [headingProgress, setHeadingProgress] = React.useState(0);
  const [inView, setInView] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);
  const [rightRevealed, setRightRevealed] = React.useState(false);
  const [shakeTrigger, setShakeTrigger] = React.useState(false);
  const prevProgress = React.useRef(0);

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

  // Scroll-driven heading progress — "The Screening" slides from left, "Bottleneck" from right
  React.useEffect(() => {
    const onScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const start = window.innerHeight;
      const end = window.innerHeight * 0.2;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setHeadingProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    'Resume overload slows every hire',
    'Top talent disappears in the noise',
    'Repetitive screening drains recruiter productivity',
    'Every interviewer evaluates differently',
    'AI-assisted cheating is harder to detect',
    'The best candidates rarely wait',
  ];
  const pros = [
    'Smart resume shortlisting',
    'Human-like AI interviews',
    'Real-time anti-cheating checks',
    'Detailed candidate scorecards',
    'AI-powered skill gap analysis',
    'Automated interview scheduling',
    'One platform. Faster hiring.',
  ];

  const dots = React.useMemo(() => Array.from({length:80},(_,i)=>({
    left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
    size:Math.random()*3+1.5, delay:Math.random()*5, duration:Math.random()*3+3,
    opacity:Math.random()*0.5+0.2,
  })),[]);

  return (
    <div style={{ position:'relative', zIndex:2, paddingBottom:'30px' }}>
      {/* Shining dots background */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <style>{`@keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
        {dots.map((d,i)=>(
          <div key={i} style={{
            position:'absolute', left:d.left, top:d.top, width:d.size, height:d.size,
            borderRadius:'50%', background:'#2dd4bf',
            boxShadow:`0 0 ${d.size*2}px rgba(45,212,191,0.6), 0 0 ${d.size*4}px rgba(45,212,191,0.3)`,
            animation:`twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
            opacity:d.opacity,
          }} />
        ))}
      </div>
      {/* Glowing cut-line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191,0.55), 0 4px 80px rgba(45,212,191,0.18)',
        zIndex: 20, pointerEvents: 'none',
      }} />

      {/* Heading above the scroll container */}
      <div ref={headingRef} data-scroll data-scroll-speed="-0.1" style={{
        textAlign:'center', padding:'160px clamp(16px, 4vw, 48px) 0',
        position:'relative', zIndex:3,

      }}>

        <h2 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(2.4rem, 5.5vw, 4rem)', fontWeight:700, color:'#EEEEEE', letterSpacing:'-0.02em', lineHeight:1.15, margin:0 }}>
          <span style={{ display:'inline-block', transform:`translateX(${(1-headingProgress)*-120}px)`, opacity:headingProgress, transition:'transform 0.1s linear, opacity 0.1s linear' }}>The Screening</span>{' '}
          <span style={{ display:'inline-block', background:'linear-gradient(135deg,#2dd4bf,#64a0dc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', transform:`translateX(${(1-headingProgress)*120}px)`, opacity:headingProgress, transition:'transform 0.1s linear, opacity 0.1s linear' }}>Bottleneck</span>
        </h2>
        <p style={{ fontFamily:'Outfit,sans-serif', fontSize:'clamp(16px, 2vw, 20px)', color:'#888880', margin:'24px 0 0 0' }}>
          What Actually Eats Your Hiring Week
        </p>
      </div>

      <div style={{ marginTop: '0px' }} />

      {/* Scroll container — heading NOT inside */}
      <div id="avatar-explainer" ref={sectionRef} style={{ height:'250vh', position:'relative', zIndex:2 }}>
        <div data-scroll style={{ position:'sticky', top:0, height:'100vh', background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'80px 0', zIndex:2 }}>

          <style dangerouslySetInnerHTML={{__html:`
            .ts-grid { display: grid; grid-template-columns: auto 120px auto; gap: 120px; justify-content: space-evenly; }
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
            @keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
            .badge-shine{animation:badgeShine 6s linear infinite}
            @keyframes badgeShine{0%{background-position:300% 50%}100%{background-position:-100% 50%}}
            @keyframes rightBoomReveal {
              0%   { opacity:0; transform:scale(0.1) translateX(40px); filter:brightness(5) blur(20px); }
              40%  { opacity:1; transform:scale(1.25) translateX(-6px); filter:brightness(1.8) blur(4px); }
              65%  { transform:scale(0.92) translateX(2px); filter:brightness(1) blur(0); }
              82%  { transform:scale(1.06) translateX(-1px); }
              100% { opacity:1; transform:scale(1) translateX(0); filter:brightness(1) blur(0); }
            }
          `}} />

          {/* 3-column grid — no heading inside */}
          <div className="ts-grid" style={{ display:'grid', gridTemplateColumns:'auto 120px auto', gap:'clamp(50px, 8vw, 120px)', width:'100%', maxWidth:1800, alignItems:'center', justifyContent:'space-evenly', position:'relative', zIndex:10, marginTop: '40px' }}>

            {/* LEFT CARD */}
            <div data-scroll data-scroll-speed="-0.15" style={{ opacity:0, animation: inView ? 'leftBoomReveal 1s cubic-bezier(0.34,1.56,0.64,1) 0.5s forwards' : 'none' }}>
              <div style={{ animation: inView ? 'floatCard 2.5s ease-in-out infinite' : 'none' }}>
              <TiltCard style={{ width:'min(330px, 100%)', minHeight:450, background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'24px 28px', boxShadow:'0 0 30px rgba(255,255,255,0.25), 0 0 60px rgba(255,255,255,0.08), 0 15px 30px rgba(0,0,0,0.4)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxSizing:'border-box' }}>
                <h3 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(20px, 2.5vw, 26px)', fontWeight:700, color:'#DDDDDD', marginBottom:8, letterSpacing:'-0.01em', textAlign:'center' }}>A typical hiring week</h3>
                <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#666660', marginBottom:28, textAlign:'center' }}>Where your recruiter hours actually go</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:16, alignItems:'flex-start', width:'100%' }}>
                  {cons.map((item, idx) => (
                    <li key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <span style={{ color:'#DDDDDD', fontWeight:'bold', fontSize:15, flexShrink:0 }}>✕</span>
                      <span style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#888880', lineHeight:1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
              </div>
            </div>

            {/* CENTRE */}
            <FadeUpOnScroll delay={0.1} y={30} threshold={0.6}>
              <div data-scroll className={shakeTrigger ? 'morph-shake' : ''}>
                <MorphBlob progress={progress} />
              </div>
            </FadeUpOnScroll>

            {/* RIGHT CARD — boom in after human → AI morph */}
            <div data-scroll data-scroll-speed="-0.15" style={{ opacity:0, animation: rightRevealed ? 'rightBoomReveal 1s cubic-bezier(0.34,1.56,0.64,1) 0s forwards' : 'none', marginRight:'20px' }}>
              <div style={{ animation: rightRevealed ? 'floatCard 2.5s ease-in-out infinite' : 'none' }}>
              <TiltCard
                className={progress > 0.75 ? 'pulse-glow' : ''}
                style={{ width:'min(330px, 100%)', minHeight:450, background:'rgba(45,212,191,0.02)', border:'1.5px solid rgba(45,212,191,0.3)', borderRadius:20, padding:'24px 28px', boxShadow:'0 0 25px rgba(45,212,191,0.08), 0 15px 30px rgba(0,0,0,0.4)', pointerEvents:rightRevealed?'auto':'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxSizing:'border-box' }}
              >
                <h3 style={{ fontFamily:'Outfit, sans-serif', fontSize:'clamp(20px, 2.5vw, 26px)', fontWeight:700, color:'#2dd4bf', marginBottom:8, letterSpacing:'-0.01em', textAlign:'center' }}>A week with Lina</h3>
                <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#666660', marginBottom:28 }}>What automated interviews actually ship</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:16 }}>
                  {pros.map((item, idx) => (
                    <li key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <span style={{ color:'#2dd4bf', fontWeight:'bold', fontSize:15, flexShrink:0 }}>✓</span>
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
    </div>
  );
};
