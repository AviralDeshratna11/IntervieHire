'use client';
import React from 'react';
import { FooterCTA, PilotSection } from '../sections';
import { Navbar } from '../layout';

export default function BookDemoPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column',
      position: 'relative', fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Golden cut-line top */}
      <div className="bd-cutline bd-cutline--top" />

      <Navbar simple />

      {/* Main interactive content */}
      <PilotSection />

      <FooterCTA />

      {/* Golden cut-line bottom */}
      <div className="bd-cutline bd-cutline--bottom" />
    </div>
  );
}
