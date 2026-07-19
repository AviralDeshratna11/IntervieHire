'use client';
import React from 'react';
import { FEATURE_STEPS } from '../../constants';
import { useMediaQuery } from '../../hooks';

/**
 * FeaturesStepsSection
 * "How It Works" — animated vertical alternating card timeline.
 */
export function FeaturesStepsSection() {
  const [cardIn, setCardIn] = React.useState([]);
  const cardRefs = React.useRef([]);
  const isTinyPhone = useMediaQuery('(max-width: 480px)');

  React.useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, FEATURE_STEPS.length);
  }, []);

  React.useEffect(() => {
    cardRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardIn(prev => { const n = [...prev]; n[i] = true; return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(ref);
    });
  }, []);

  return (
    <section data-scroll style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(16px, 4vw, 48px) 20px',
      background: '#000', overflow: 'hidden',
    }}>
      <style>{`
        .fp-vert-card {
          border-radius: 20px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
          position: relative;
          padding: clamp(24px, 3vw, 36px);
        }
        .fp-vert-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          border-radius: 2px 2px 0 0;
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .fp-vert-card:hover::before { opacity: 1; }
        .fp-card-white {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
        }
        .fp-card-white:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }
        .fp-card-white::before {
          background: linear-gradient(90deg, #fff, #aaa);
        }
        .fp-card-blue {
          border: 1px solid rgba(45,212,191,0.2);
          background: rgba(45,212,191,0.06);
        }
        .fp-card-blue:hover {
          border-color: rgba(45,212,191,0.4);
          background: rgba(45,212,191,0.12);
          transform: translateY(-3px);
        }
        .fp-card-blue::before {
          background: linear-gradient(90deg, #2dd4bf, #64a0dc);
        }
        @keyframes fpSlideInLeft {
          0%   { opacity: 0; transform: translateX(-60px) scale(0.97); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes fpSlideInRight {
          0%   { opacity: 0; transform: translateX(60px) scale(0.97); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(11px, 1.8vw, 13px)', fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2dd4bf', marginBottom: 12
          }}>
            How It Works
          </div>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 700, color: '#F5F0E8', maxWidth: 600, margin: '0 auto', lineHeight: 1.2, whiteSpace: 'nowrap'
          }}>
            See IntervieHire in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Action.</span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {FEATURE_STEPS.map((step, i) => (
            <div
              key={i}
              ref={el => cardRefs.current[i] = el}
              className={`fp-vert-card ${i % 2 === 0 ? 'fp-card-white' : 'fp-card-blue'}`}
              style={{
                marginLeft: isTinyPhone ? 0 : (i % 2 === 0 ? 0 : 'clamp(24px, 4vw, 60px)'),
                opacity: 0,
                animation: cardIn[i]
                  ? (i % 2 === 0
                    ? 'fpSlideInLeft 0.9s cubic-bezier(0.16,1,0.3,1) forwards'
                    : 'fpSlideInRight 0.9s cubic-bezier(0.16,1,0.3,1) forwards')
                  : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05))',
                  border: '1px solid rgba(45,212,191,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 700, color: '#2dd4bf',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(15px, 1.8vw, 17px)', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
                      {step.title}
                    </h4>
                    {step.time && (
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(11px, 1.8vw, 13px)', fontWeight: 500, color: '#2dd4bf', letterSpacing: '0.04em' }}>
                        ~ {step.time}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#888880', lineHeight: 1.65, margin: '0 0 14px', maxWidth: 600 }}>
                    {step.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(step.features || []).map((f, fi) => (
                      <span key={fi} style={{
                        fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(11px, 1.8vw, 13px)', fontWeight: 600, letterSpacing: '0.04em',
                        color: 'rgba(45,212,191,0.7)', background: 'rgba(45,212,191,0.06)',
                        border: '1px solid rgba(45,212,191,0.1)', borderRadius: 99, padding: '4px 12px',
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
