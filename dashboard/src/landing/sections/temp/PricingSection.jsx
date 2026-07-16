'use client';
import React, { useRef, useEffect, useState } from 'react';

import { PRICING_SECTION_PLANS } from '../constants';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.3" />
    <path d="M5 8.5L7 10.5L11 6" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sparkle = ({ delay, x, y, size }) => (
  <div className="pr-sparkle" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }} />
);

export const PricingSection = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          setInView(true);
          setHasEntered(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [hasEntered]);

  return (
    <section ref={sectionRef} id="pricing" style={{
      background: '#000',
      padding: 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 48px)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(45,212,191,0.08)',
      borderBottom: '1px solid rgba(45,212,191,0.08)',
    }}>
      {/* Golden glow top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191,0.55)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Floating sparkles */}
      <Sparkle delay={0} x={10} y={15} size={4} />
      <Sparkle delay={0.8} x={85} y={20} size={3} />
      <Sparkle delay={1.5} x={15} y={75} size={5} />
      <Sparkle delay={0.3} x={90} y={80} size={3} />
      <Sparkle delay={1.1} x={50} y={10} size={3} />
      <Sparkle delay={0.6} x={75} y={50} size={4} />
      <Sparkle delay={1.8} x={25} y={45} size={3} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)', opacity: 0, animation: inView ? 'prHeaderIn 0.9s cubic-bezier(0.16,1,0.3,1) 0s forwards' : 'none' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '6px 16px', borderRadius: 100,
            fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
            background: 'rgba(45,212,191,0.1)',
            border: '1px solid rgba(45,212,191,0.2)',
            color: '#2dd4bf', marginBottom: 12,
          }}>
            <span style={{ marginRight: 6 }}>🏆</span> Pricing
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
            color: '#EEEEEE', letterSpacing: '-0.02em',
            lineHeight: 1.15, margin: '0 auto',
          }}>
            Simple, transparent{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>pricing</span>
          </h2>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(14px, 2vw, 16px)', color: '#888880',
            marginTop: 12, maxWidth: 500, margin: '12px auto 0',
          }}>
            Start for free, scale with confidence. No hidden fees.
          </p>
        </div>

        {/* Cards */}
        <div className="pr-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(16px, 2.5vw, 24px)',
          alignItems: 'stretch',
        }}>
          {PRICING_SECTION_PLANS.map((plan, i) => {
            const isPopular = plan.badge === 'Most Popular';
            const delay = 0.2 + i * 0.15;

            return (
              <div
                key={i}
                className={`pr-card ${isPopular ? 'pr-card--popular' : ''}`}
                style={{
                  opacity: 0,
                  animation: inView
                    ? `prCardIn 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards`
                    : 'none',
                  '--accent': plan.color,
                }}
              >
                {/* Glow behind popular card */}
                {isPopular && <div className="pr-popular-glow" />}

                {/* Badge */}
                {plan.badge && (
                  <div className="pr-badge">
                    <div className="pr-badge-inner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#2dd4bf" />
                      </svg>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 700,
                    color: isPopular ? '#2dd4bf' : '#EEEEEE',
                    letterSpacing: '-0.01em', margin: '0 0 4px',
                  }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 16 }}>
                    <span style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 700,
                      color: '#EEEEEE', letterSpacing: '-0.03em',
                    }}>{plan.price}</span>
                    {plan.period && (
                      <span style={{
                        fontFamily: 'Outfit, sans-serif', fontSize: 14,
                        color: '#666660',
                      }}>{plan.period}</span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 14,
                    color: '#888880', marginTop: 8, margin: '8px 0 0',
                    lineHeight: 1.5,
                  }}>{plan.desc}</p>
                </div>

                {/* Features */}
                <ul className="pr-features" style={{
                  listStyle: 'none', padding: 0, margin: '0 0 28px',
                  display: 'flex', flexDirection: 'column', gap: 12, flex: 1,
                }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="pr-feature-item" style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <CheckIcon />
                      <span style={{
                        fontFamily: 'Outfit, sans-serif', fontSize: 14,
                        color: isPopular ? '#e0ddd5' : '#999990',
                        lineHeight: 1.4,
                      }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`pr-cta ${isPopular ? 'pr-cta--primary' : 'pr-cta--secondary'}`}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .pr-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2.5vw, 24px);
          align-items: stretch;
        }

        @media (max-width: 768px) {
          .pr-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }

        .pr-card {
          position: relative;
          border-radius: 20px;
          padding: clamp(28px, 3vw, 40px) clamp(20px, 2.5vw, 32px);
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s ease,
                      border-color 0.3s ease;
          overflow: hidden;
        }

        .pr-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .pr-card--popular {
          background: linear-gradient(180deg, rgba(45,212,191,0.06) 0%, rgba(45,212,191,0.01) 100%);
          border-color: rgba(45,212,191,0.3);
          box-shadow: 0 0 40px rgba(45,212,191,0.08), 0 10px 30px rgba(0,0,0,0.4);
          transform: scale(1.04);
          z-index: 3;
        }

        .pr-card--popular:hover {
          border-color: rgba(45,212,191,0.5);
          box-shadow: 0 0 60px rgba(45,212,191,0.15), 0 20px 60px rgba(0,0,0,0.5);
          transform: scale(1.04) translateY(-6px);
        }

        .pr-popular-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: prGlowPulse 3s ease-in-out infinite;
        }

        .pr-badge {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .pr-badge-inner {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: 100px;
          background: linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05));
          border: 1px solid rgba(45,212,191,0.3);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #2dd4bf;
          text-transform: uppercase;
          animation: prBadgePulse 2.5s ease-in-out infinite;
        }

        .pr-features {
          flex: 1;
        }

        .pr-feature-item {
          opacity: 0.8;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .pr-card:hover .pr-feature-item {
          opacity: 1;
        }

        .pr-cta {
          width: 100%;
          padding: 14px 24px;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .pr-cta:hover {
          transform: scale(1.03);
        }

        .pr-cta--primary {
          background: linear-gradient(135deg, #2dd4bf, #64a0dc);
          color: #000;
          box-shadow: 0 0 20px rgba(45,212,191,0.3);
        }

        .pr-cta--primary:hover {
          box-shadow: 0 0 30px rgba(45,212,191,0.5);
        }

        .pr-cta--secondary {
          background: rgba(255,255,255,0.04);
          color: #EEEEEE;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .pr-cta--secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }

        .pr-sparkle {
          position: absolute;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 6px rgba(45,212,191,0.8);
          pointer-events: none;
          animation: prSparkle 3s ease-in-out infinite;
        }

        @keyframes prHeaderIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes prCardIn {
          0% { opacity: 0; transform: translateY(60px) scale(0.92); filter: blur(8px); }
          60% { filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes prGlowPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
          50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
        }

        @keyframes prBadgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.2); }
          50% { box-shadow: 0 0 20px 4px rgba(45,212,191,0.15); }
        }

        @keyframes prSparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          30% { opacity: 1; transform: scale(1); }
          60% { opacity: 0.5; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </section>
  );
};
