'use client';
import React from 'react';
import { useMediaQuery } from '../../hooks';



// ─── HeroSection ──────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const [phase, setPhase] = React.useState(0);
  const ref = React.useRef(null);
  const [dissolve, setDissolve] = React.useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setPhase(1), 100);
        setTimeout(() => setPhase(2), 300);
        setTimeout(() => setPhase(3), 700);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const outer = ref.current.parentElement?.parentElement;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const scrollable = outer.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { setDissolve(0); return; }
      setDissolve(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const contentStyle = {
    opacity: 1 - dissolve,
    transform: `scale(${1 - dissolve * 0.15}) translateY(${dissolve * 30}px)`,
  };

  const videoStyle = {
    opacity: 1 - dissolve * 0.7,
    transform: `scale(${1 - dissolve * 0.2})`,
  };

  return (
    <section ref={ref} style={{
      minHeight: '100vh',
      marginBottom: '15vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(80px, 10vw, 110px) clamp(16px, 4vw, 48px) clamp(24px, 4vw, 40px) 0px',
      boxSizing: 'border-box',
    }}>

      {/* Video: RIGHT half */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: isMobile ? '0%' : '65%', height: '100%',
        overflow: 'hidden', background: '#000000', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        ...videoStyle,
      }}>
        <video
          id="hero-pipeline-video"
          src="/Conveyor (3).mp4"
          autoPlay muted loop playsInline
          style={{
            width: '100%', height: '100%', objectFit: 'contain', display: 'block',
            marginTop: '24vh', marginRight: '-6vw', opacity: 1,
            transform: phase >= 2 ? 'scale(1)' : 'scale(0.6)',
            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0s',
          }}
        />
        {/* Edge fades */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '38%', height: '100%', background: 'linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 130, background: 'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: '100%', background: 'linear-gradient(to left, #000000 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Left solid backing */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? '100%' : '35%', height: '100%', background: '#000000', zIndex: 2, pointerEvents: 'none' }} />

      {/* Content */}
      <div data-scroll style={{ position: 'relative', zIndex: 3, maxWidth: 620, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginLeft:'-40px', ...contentStyle }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: 'clamp(40px, 6vh, 56px)', color: '#EEEEEE', fontSize: isMobile ? 'clamp(2.5rem, 8vw, 3.6rem)' : 'clamp(3.2rem, 10vh, 5.5rem)' }}>
          <span style={{ display: 'inline-block', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(70px)', transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }}>Less Screening.</span>{' '}
          <span className="hero-shine" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2dd4bf 0%, #2dd4bf 35%, #7df2e8 45%, #96f7ef 50%, #7df2e8 55%, #2dd4bf 65%, #2dd4bf 100%)', backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(70px)', transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }}>Better Hiring.</span>
          <style>{`@keyframes heroShine{0%{background-position:300% 50%}100%{background-position:-100% 50%}}.hero-shine{animation:heroShine 6s linear infinite}`}</style>
        </h1>

        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(17px, 2.8vh, 22px)', fontWeight: 400, color: '#B0B0B0', lineHeight: 1.6, maxWidth: 520, marginBottom: 'clamp(44px, 7vh, 60px)', opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s' }}>
          From finding the right candidates to making the final hiring decision, IntervieHire automates every stage of recruitment with AI-powered sourcing, resume shortlisting, intelligent interviews, and advanced integrity checks, so you can hire with speed and confidence.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s' }}>
          <HeroBtn primary onClick={() => window.location.href = '/book-demo'}>Book a Demo</HeroBtn>
          <HeroBtn onClick={() => window.location.href = '/features'}>See How It Works</HeroBtn>
        </div>
        <style>{`
          .hero-btn-primary {
            background: #2dd4bf; color: #0A0A0A;
            transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
            box-shadow: 0 4px 16px rgba(45,212,191,0.25);
          }
          .hero-btn-primary::after {
            content: ''; position: absolute; inset: 0; border-radius: 8px;
            background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
            background-size: 200% 100%;
            opacity: 0; transition: opacity 0.3s ease;
          }
          .hero-btn-primary:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 24px rgba(45,212,191,0.3);
          }
          .hero-btn-primary:hover::after {
            opacity: 1;
            animation: heroBtnShine 0.8s ease;
          }
          .hero-btn-secondary {
            background: #F5F0E8; color: #0A0A0A;
            border: 1.5px solid #F5F0E8 !important;
            transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
            box-shadow: 0 4px 16px rgba(160,160,160,0.2);
          }
          .hero-btn-secondary::after {
            content: ''; position: absolute; inset: 0; border-radius: 8px;
            background: linear-gradient(105deg, transparent 30%, rgba(160,160,160,0.4) 50%, transparent 70%);
            background-size: 200% 100%;
            opacity: 0; transition: opacity 0.3s ease;
          }
          .hero-btn-secondary:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 24px rgba(160,160,160,0.25);
          }
          .hero-btn-secondary:hover::after {
            opacity: 1;
            animation: heroBtnShine 0.8s ease;
          }
          @keyframes heroBtnShine {
            0% { background-position: 200% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>

      </div>
    </section>
  );
};

// ─── HeroBtn ──────────────────────────────────────────────────────────────────
export const HeroBtn = ({ children, primary, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={primary ? 'hero-btn-primary' : 'hero-btn-secondary'}
      style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600,
        padding: 'clamp(11px, 1.6vh, 14px) clamp(22px, 2.8vw, 34px)', borderRadius: 8, cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        border: 'none', outline: 'none',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </button>
  );
};
