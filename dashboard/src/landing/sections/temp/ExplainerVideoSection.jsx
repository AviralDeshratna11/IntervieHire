'use client';
import React from 'react';
import { Eyebrow, FadeUpOnScroll } from '../ui';

import { FEATURE_STEPS } from '../constants';

export const ExplainerVideoSection = () => {
  const steps = FEATURE_STEPS;


  const sectionRef = React.useRef(null);
  const [dissolve, setDissolve] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const heading = document.querySelector('#calculator h2');
      if (!heading) return;
      const rect = heading.getBoundingClientRect();
      const triggerAt = window.innerHeight * 0.8;
      const range = window.innerHeight * 0.2;
      const d = Math.max(0, Math.min(1, (triggerAt - rect.top) / range));
      setDissolve(d);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section data-scroll
      ref={sectionRef}
      id="explainer-video" 
      style={{ 
        background: '#050505', 
        padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 48px)', 
        marginBottom: '60vh',
        position: 'relative', 
        overflow: 'hidden',
        borderTop: '1px solid rgba(217,100,36,0.08)',
      }}
    >
      {/* Black overlay that fades in as section scrolls past */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
        background: '#050505',
        opacity: dissolve,
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Heading — fades up on scroll */}
        <FadeUpOnScroll delay={0.0} y={40}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Eyebrow>Product Demo</Eyebrow>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#EEEEEE',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}>
              See IntervieHire in <span style={{
                background: 'linear-gradient(90deg, #d96424, #8a3a10)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Action.</span>
            </h2>
          </div>
        </FadeUpOnScroll>

        {/* Grid — video + steps */}
        <div className="ev-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 60,
          alignItems: 'center'
        }}>
          {/* Left: Video — slides left on scroll-out */}
          <div style={{ transform: `translateX(${-dissolve * 200}px)`, opacity: 1 - dissolve }}>
            <FadeUpOnScroll delay={0.15} y={40}>
            <div style={{
              position: 'relative',
              background: '#000',
              border: '1px solid rgba(217,100,36, 0.15)',
              borderRadius: 24,
              aspectRatio: '16/9',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <video
                src="/mp_.mp4"
                autoPlay muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </FadeUpOnScroll>
          </div>

          {/* Right: Step-by-Step Checklist — slides right on scroll-out */}
          <div style={{ transform: `translateX(${dissolve * 200}px)`, opacity: 1 - dissolve }}>
          <div className="ev-steps" style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: 'clamp(10px, 2vw, 20px)' }}>
            {/* Timeline track line */}
            <div style={{
              position: 'absolute', 
              left: 'clamp(27px, 5vw, 31px)', 
              top: 20, 
              bottom: 20,
              width: 2, 
              background: 'rgba(217,100,36, 0.15)',
              zIndex: 1,
            }} />

            {steps.map((step, idx) => (
              <FadeUpOnScroll key={idx} delay={0.1 + idx * 0.1} y={30}>
                <div style={{
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 'clamp(10px, 2vw, 16px)',
                  marginBottom: idx < steps.length - 1 ? 'clamp(20px, 3vw, 32px)' : 0,
                  position: 'relative', 
                  zIndex: 2,
                }}>
                  <div style={{
                    width: 'clamp(20px, 4vw, 24px)', 
                    height: 'clamp(20px, 4vw, 24px)', 
                    borderRadius: '50%',
                    background: '#d96424',
                    border: '2px solid #d96424',
                    color: '#050505',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 12, 
                    fontWeight: 700,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(217,100,36, 0.3)',
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif', 
                      fontSize: 'clamp(15px, 2.5vw, 18px)',
                      fontWeight: 700, 
                      color: '#EEEEEE',
                      marginBottom: 4,
                    }}>{step.title}</h3>
                    <p style={{
                      fontFamily: 'Outfit, sans-serif', 
                      fontSize: 'clamp(12px, 2vw, 14px)',
                      color: '#888880', 
                      lineHeight: 1.4,
                    }}>{step.desc}</p>
                  </div>
                </div>
              </FadeUpOnScroll>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
