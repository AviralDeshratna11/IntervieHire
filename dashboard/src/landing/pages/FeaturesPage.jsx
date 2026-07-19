'use client';
import React from 'react';
import { Navbar } from '../layout';
import { SmoothScrollProvider } from '../providers';
import { FooterCTA, ManifestoSection, LinaInterviewerSection, FeaturesDemoSection, FeaturesStepsSection } from '../sections';

export default function FeaturesPage() {
  return (
    <SmoothScrollProvider>
      <div className="ih-landing" style={{ background: '#000' }}>
        <Navbar simple />
        
        {/* Eyebrow, Heading, and sticky-scrolling Video Demo */}
        <FeaturesDemoSection />

        {/* Alternate vertical steps card timeline */}
        <FeaturesStepsSection />

        <ManifestoSection />
        <LinaInterviewerSection />
        <FooterCTA />
      </div>
    </SmoothScrollProvider>
  );
}
