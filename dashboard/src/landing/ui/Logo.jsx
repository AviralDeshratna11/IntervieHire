'use client';
import React from 'react';

// ─── Logo ─────────────────────────────────────────────────────────────────────
// Extracted from Navbar.jsx so it can be used independently across the page
// (e.g. FooterCTA) without importing from the layout layer.
export const Logo = ({ size = 22 }) => (
  <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Outfit, sans-serif', fontSize: size, fontWeight: 700, letterSpacing: '-0.02em' }}>
    <span style={{ color: '#F5F0E8' }}>intervie</span>
    <span style={{ background: 'linear-gradient(90deg,#d96424, #8a3a10)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hire</span>
    <svg style={{ marginLeft: 4 }} width={size * 0.7} height={size * 0.7} viewBox="0 0 22 22" fill="none">
      <path d="M6 16L16 6M16 6H9M16 6V13" stroke="#DDDDDD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);
