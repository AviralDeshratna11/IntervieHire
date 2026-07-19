'use client';
import React, { useRef, useState, useEffect } from 'react';

/**
 * PricingCtaSection
 * The bottom CTA area for the /pricing page.
 */
export function PricingCtaSection() {
  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCtaVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ctaRef} style={{
      position: 'relative', zIndex: 5, maxWidth: 800, margin: '0 auto',
      padding: '0 clamp(16px, 4vw, 48px) clamp(80px, 10vh, 120px)', textAlign: 'center',
    }}>
      <div style={{
        opacity: 0,
        animation: ctaVisible ? 'ctaReveal 1s cubic-bezier(0.16,1,0.3,1) 0s forwards' : 'none',
      }}>
        <h2 className="pp-headline">
          Ready to{' '}
          <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>join us?</span>
        </h2>
        <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: '#888880', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Start hiring smarter with AI-powered interviews and built-in integrity checks.
        </p>
        <button
          id="pp-book-demo-btn"
          onClick={() => window.location.href = '/book-demo'}
          className="pp-cta pp-cta--primary"
          style={{ width: 'auto', padding: '16px 36px' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(45,212,191,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(45,212,191,0.25)'; }}
        >
          Book a Demo â†’
        </button>
      </div>
    </div>
  );
}
