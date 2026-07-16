'use client';
import React from 'react';
import { Eyebrow, FadeUpOnScroll } from '../../ui';

/**
 * FeaturesDemoSection
 * Features page hero: eyebrow heading + 300vh scroll-based scale video demo.
 */
export function FeaturesDemoSection() {
  const videoRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!videoRef.current) return;
      const rect = videoRef.current.getBoundingClientRect();
      const total = videoRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const t = progress;
  const scale = t < 0.5 ? 0.7 + (t / 0.5) * 0.3 : 1 - ((t - 0.5) / 0.5) * 0.3;
  const radius = t < 0.5 ? 20 * (1 - t / 0.5) : 20 * ((t - 0.5) / 0.5);

  return (
    <>
      {/* Heading */}
      <div style={{ padding: 'clamp(80px,10vw,140px) clamp(16px,4vw,48px) 0', textAlign: 'center' }}>
        <FadeUpOnScroll delay={0} y={40}>
          <Eyebrow>Product Demo</Eyebrow>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 700, color: '#F5F0E8',
            letterSpacing: '-0.02em', lineHeight: 1.15,
            maxWidth: 800, margin: '0 auto',
          }}>
            From source to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>shortlist.</span>
          </h2>
        </FadeUpOnScroll>
      </div>

      {/* 300vh scroll-based scale video */}
      <section data-scroll ref={videoRef} style={{ height: '300vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column',
          background: '#000', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: radius,
              overflow: 'hidden',
              background: '#0A0A0A',
              border: t < 0.1 || t > 0.9 ? '1px solid rgba(45,212,191,0.1)' : 'none',
              boxShadow: t >= 0.2 && t <= 0.8
                ? '0 0 100px rgba(45,212,191,0.08)'
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
    </>
  );
}
