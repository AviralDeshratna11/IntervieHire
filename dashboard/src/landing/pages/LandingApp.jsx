'use client';
import React from 'react';
import { Navbar } from '../layout';
import {
  HeroSection,
  TheProblemSection,
  TransitionSection,
  SolutionSection,
  CalculatorSection,
  HiringChaosSection,
  BudgetCtaSection,
  BookDemoCtaSection,
  FAQSection,
  FooterCTA,
} from '../sections';
import { SmoothScrollProvider } from '../providers';

export default function LandingApp() {
  return (
    <SmoothScrollProvider>
      <div className="ih-landing" style={{ padding: '0 clamp(16px, 3vw, 48px)' }}>
        <Navbar />

        {/* Hero — sticky until TheProblem slides over it */}
        <div style={{ position: 'relative', height: '240vh' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 1 }}>
            <HeroSection />
          </div>
        </div>

        {/* TheProblemSection slides over the hero */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: '-100vh' }}>
          <TheProblemSection />
        </div>

        <TransitionSection />
        <SolutionSection />
        <HiringChaosSection />

        <BudgetCtaSection />

        {/* CalculatorSection slides over BudgetCta */}
        <div style={{ position: 'relative', zIndex: 3, marginTop: '-100vh' }}>
          <CalculatorSection />
        </div>

        {/* Book a Demo CTA */}
        <BookDemoCtaSection />

        <FAQSection />
        <FooterCTA />
      </div>
    </SmoothScrollProvider>
  );
}
