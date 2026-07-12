'use client';
import React from 'react';

export const DemoVideoSection = () => {
  const sectionRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [headingIn, setHeadingIn] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slow smooth fade-in as section enters viewport from bottom
  const maxRatio = React.useRef(0);
  React.useEffect(() => {
    if (!headingRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > maxRatio.current) {
          maxRatio.current = entry.intersectionRatio;
          setHeadingIn(entry.intersectionRatio);
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    obs.observe(headingRef.current);
    return () => obs.disconnect();
  }, []);

  const t = progress;
  const scale = t < 0.5 ? 0.7 + (t / 0.5) * 0.3 : 1 - ((t - 0.5) / 0.5) * 0.3;
  const radius = t < 0.5 ? 20 * (1 - t / 0.5) : 20 * ((t - 0.5) / 0.5);

  // Fade out: 1 → 0 between 20% and 40%
  const fadeOut = t < 0.2 ? 1 : t < 0.4 ? 1 - (t - 0.2) / 0.2 : 0;
  const headingOpacity = headingIn * fadeOut;
  const headingHeight = t < 0.2 ? 120 : t < 0.4 ? 120 * (1 - (t - 0.2) / 0.2) : 0;

  return (
    <section data-scroll ref={sectionRef} style={{ height: '300vh', position: 'relative', marginTop: 'clamp(40px, 4vw, 80px)' }}>
      <style dangerouslySetInnerHTML={{__html:`
        .demo-heading { padding: 0 48px; }
        @media (max-width: 768px) { .demo-heading { padding: 0 16px; } }
      `}} />
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        background: '#000', overflow: 'hidden',
      }}>
        {/* Heading — fade in as section enters viewport, shrink out on scroll */}
        <div ref={headingRef} className="demo-heading" style={{
          flexShrink: 0, textAlign: 'center', overflow: 'hidden',
          opacity: headingOpacity,
          height: `${headingHeight}px`,
          transform: `translateY(${(1 - headingIn) * 24}px)`,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          paddingBottom: 4,
        }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#DDDDDD',
            marginBottom: 8, opacity: headingIn,
            transform: `translateY(${(1 - headingIn) * 16}px)`,
          }}>
            The Problem
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700, color: '#EEEEEE',
            letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: 520,
            margin: '0 auto',
          }}>
            <span style={{ display: 'inline-block', opacity: headingIn, transform: `translateY(${(1 - headingIn) * 20}px)` }}>
              Traditional hiring is{' '}
            </span>
            <span style={{ display: 'inline-block', color: '#DDDDDD', opacity: Math.min(1, Math.max(0, headingIn * 2 - 0.5)), transform: `translateY(${(1 - headingIn) * 24}px)` }}>
              broken
            </span>
            <span style={{ display: 'inline-block', opacity: headingIn, transform: `translateY(${(1 - headingIn) * 20}px)` }}>
              .
            </span>
          </h2>
        </div>

        {/* Video — fills remaining space, scales to full screen */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: radius,
            overflow: 'hidden',
            background: '#000000',
            border: t < 0.1 || t > 0.9 ? '1px solid rgba(217,100,36,0.1)' : 'none',
            boxShadow: t >= 0.2 && t <= 0.8
              ? '0 0 100px rgba(217,100,36,0.08)'
              : '0 20px 60px rgba(0,0,0,0.6)',
            transform: `scale(${scale})`,
            willChange: 'transform',
          }}>
            <video
              src="/mp_.mp4"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
