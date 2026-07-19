'use client';
import React from 'react';
import { PRICING_PLANS } from '../../constants';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 2 }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#2dd4bf" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.3" />
    <path d="M5 8.5L7 10.5L11 6" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * PricingPlansSection
 * Header + 3-column plan card grid for the /pricing page.
 */
export function PricingPlansSection() {
  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: 'clamp(120px, 14vh, 200px) clamp(16px, 4vw, 48px) clamp(60px, 8vh, 100px)',
    }}>
      <div style={{ maxWidth: 1100, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 4vh, 48px)' }}>
          <div className="pp-eyebrow">
            <StarIcon />
            Pricing
          </div>
          <h2 className="pp-headline">
            Simple, transparent{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>pricing</span>
          </h2>
          <p style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#888880', marginTop: 8, maxWidth: 480, margin: '8px auto 0' }}>
            Start for free, scale with confidence. No hidden fees.
          </p>
        </div>

        {/* Plan cards */}
        <div className="pp-grid">
          {PRICING_PLANS.map((plan, i) => {
            const isPopular = plan.badge === 'Most Popular';
            const delay = 0.2 + i * 0.15;
            return (
              <div
                key={i}
                className={`pp-card${isPopular ? ' pp-card--popular' : ''}`}
                style={{ animation: `ppCardIn 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards` }}
              >
                {isPopular && <div className="pp-popular-glow" />}
                {plan.badge && (
                  <div className="pp-badge">
                    <div className="pp-badge-inner">
                      <StarIcon />
                      {plan.badge}
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <h3 className={`pp-plan-name${isPopular ? ' pp-plan-name--popular' : ''}`}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 12 }}>
                    <span className="pp-price">{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 13, color: '#666660' }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#888880', marginTop: 8, margin: '8px 0 0', lineHeight: 1.5 }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="pp-feature-item" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckIcon />
                      <span style={{ fontSize: 13, color: isPopular ? '#e0ddd5' : '#999990', lineHeight: 1.4 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`pp-cta${isPopular ? ' pp-cta--primary' : ' pp-cta--secondary'}`}
                  onClick={() => window.location.href = '/book-demo'}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
