'use client';
import React from 'react';
import { Navbar } from '../layout';
import { SmoothScrollProvider } from '../providers';
import { FooterCTA, PricingPlansSection, PricingIncludedSection, PricingCtaSection } from '../sections';

const Sparkle = ({ delay, x, y, size }) => (
  <div className="pp-sparkle" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }} />
);

export default function PricingPage() {
  return (
    <SmoothScrollProvider>
      <div className="ih-landing" style={{ background: '#000' }}>
        <Navbar simple />

        <div style={{ position: 'relative' }}>
          {/* Golden cut-line top */}
          <div className="pp-cutline pp-cutline--top" />

          {/* Background glows */}
          <div className="pp-glow pp-glow--center" />
          <div className="pp-glow pp-glow--br" />
          <div className="pp-glow pp-glow--bl" />

          <Sparkle delay={0}   x={8}  y={12} size={4} />
          <Sparkle delay={0.8} x={88} y={18} size={3} />
          <Sparkle delay={1.5} x={12} y={78} size={5} />
          <Sparkle delay={0.3} x={92} y={82} size={3} />
          <Sparkle delay={1.1} x={50} y={6}  size={3} />
          <Sparkle delay={0.6} x={72} y={48} size={4} />
          <Sparkle delay={1.8} x={28} y={42} size={3} />
          <Sparkle delay={2.2} x={40} y={70} size={3} />

          {/* ── Pricing Plan Cards ── */}
          <PricingPlansSection />

          {/* ── Included in Every Plan Feature Grid ── */}
          <PricingIncludedSection />

          {/* ── Bottom Booking CTA ── */}
          <PricingCtaSection />

          <div style={{ position: 'relative', zIndex: 5 }}>
            <FooterCTA />
          </div>

          {/* Golden cut-line bottom */}
          <div className="pp-cutline pp-cutline--bottom" />
        </div>
      </div>
    </SmoothScrollProvider>
  );
}
