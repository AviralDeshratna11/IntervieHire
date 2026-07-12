'use client';
import React from 'react';
import { useMediaQuery } from '../../hooks';

import { HERO_WORDS1, HERO_WORDS2 } from '../../constants';

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

  const words1 = HERO_WORDS1;
  const words2 = HERO_WORDS2;

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
      padding: 'clamp(80px, 10vw, 110px) clamp(16px, 4vw, 48px) clamp(24px, 4vw, 40px)',
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
          src="/conveyor.mp4"
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
        <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: '100%', background: 'linear-gradient(to left, #000000 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Left solid backing */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? '100%' : '35%', height: '100%', background: '#000000', zIndex: 2, pointerEvents: 'none' }} />

      {/* Content */}
      <div data-scroll style={{ position: 'relative', zIndex: 3, maxWidth: 620, ...contentStyle }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: 'clamp(40px, 6vh, 56px)', color: '#EEEEEE' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px', fontSize: isMobile ? 'clamp(2.2rem, 7vw, 3.2rem)' : 'clamp(2.8rem, 9vh, 5rem)', marginBottom: 'clamp(4px, 1vh, 8px)' }}>
            {words1.map((w, i) => (
              <span key={i} style={{ display: 'inline-block', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(70px)', transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s` }}>{w}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px', fontSize: isMobile ? 'clamp(2.2rem, 7vw, 3.2rem)' : 'clamp(2.8rem, 9vh, 5rem)' }}>
            {words2.map((w, i) => (
              <span key={i} style={{ display: 'inline-block', background: i === 1 ? 'linear-gradient(90deg, #d96424, #ba5520)' : 'none', WebkitBackgroundClip: i === 1 ? 'text' : 'unset', WebkitTextFillColor: i === 1 ? 'transparent' : '#EEEEEE', backgroundClip: i === 1 ? 'text' : 'unset', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(70px)', transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s` }}>{w}</span>
            ))}
          </div>
        </h1>

        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(17px, 2.8vh, 22px)', fontWeight: 400, color: '#888880', lineHeight: 1.6, maxWidth: 520, marginBottom: 'clamp(44px, 7vh, 60px)', opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s' }}>
          AI-powered interviews 24/7 with built-in cheating detection, helping teams screen candidates faster and more reliably. No scheduling needed.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s' }}>
          <HeroBtn primary onClick={() => window.location.href = '/book-demo'}>Book a Demo</HeroBtn>
          <HeroBtn onClick={() => document.getElementById('explainer-video')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</HeroBtn>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, marginTop: 'clamp(32px, 6vh, 60px)', flexWrap: 'wrap', opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s' }}>
          {[
            { num: '$100B',  text: 'lost yearly to inefficient hiring' },
            { num: '25–35%', text: 'of manager time drained by interviews' },
            { num: '40–60',  text: 'days. Still no reliable hire.' },
          ].map((s, i) => (
            <div key={i} style={{ flex: '1 1 clamp(100px, 30vw, 140px)', padding: '0 16px', borderRight: i < 2 ? '1px solid rgba(217,100,36,0.15)' : 'none', paddingLeft: i === 0 ? 0 : 16 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px, 4vh, 32px)', fontWeight: 700, color: '#d96424', letterSpacing: '-0.02em', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2.2vh, 15px)', color: '#546a7b', lineHeight: 1.3 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── HeroBtn ──────────────────────────────────────────────────────────────────
export const HeroBtn = ({ children, primary, onClick }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600,
        padding: 'clamp(11px, 1.6vh, 14px) clamp(22px, 2.8vw, 34px)', borderRadius: 8, cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        background: primary ? '#d96424' : '#F5F0E8',
        color: primary ? '#F5F0E8' : '#0A0A0A',
        border: primary ? 'none' : '1px solid rgba(245,240,232,0.6)',
        filter: primary && hov ? 'brightness(1.12)' : 'none',
        boxShadow: primary && hov ? '0 0 30px rgba(217,100,36,0.5)' : !primary && hov ? '0 0 20px rgba(245,240,232,0.4)' : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >{children}</button>
  );
};
