'use client';
import React, { useRef, useState, useEffect } from 'react';
import { INCLUDED_FEATURES } from '../../constants';

/**
 * PricingIncludedSection
 * "Included in Every Plan" feature grid â€” animated on scroll.
 */
export function PricingIncludedSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      position: 'relative', zIndex: 5, maxWidth: 1100, margin: '0 auto',
      padding: '0 clamp(16px, 4vw, 48px) clamp(80px, 10vh, 120px)',
    }}>
      <div className="pp-separator" />
      <div style={{
        textAlign: 'center', marginBottom: 'clamp(36px, 5vh, 48px)',
        animation: visible ? 'ppHeaderIn 0.8s cubic-bezier(0.16,1,0.3,1) 0s forwards' : 'none',
        opacity: 0,
      }}>
        <div className="pp-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="22 4 12 14.01 9 11.01" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Included in Every Plan
        </div>
        <h2 className="pp-headline">
          The full{' '}
          <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lina</span>{' '}
          experience â€” no feature gating
        </h2>
      </div>

      <div className="pp-included-grid">
        {INCLUDED_FEATURES.map((feat, i) => (
          <div key={i} className="pp-feat-card" style={{
            opacity: 0,
            animation: visible ? `ppFeatIn 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s forwards` : 'none',
          }}>
            <div className="pp-feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={feat.icon} />
              </svg>
            </div>
            <div>
              <h4 className="pp-feat-title">{feat.title}</h4>
              <p className="pp-feat-desc">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
