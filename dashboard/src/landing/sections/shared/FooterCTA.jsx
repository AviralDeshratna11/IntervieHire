'use client';
import React from 'react';

import { GoldWaveSVG, Logo } from '../../ui';

export const FooterCTA = () => {
  return (
    <footer style={{ background: '#000000', padding: 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 48px)', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(217,100,36, 0.08)' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', opacity: 0.5, pointerEvents: 'none' }}>
        <GoldWaveSVG style={{ width: '100%', height: '100%' }}/>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ paddingTop: 0 }}>
          <div className="footer-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <Logo size={20}/>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#555550', marginTop: 10, letterSpacing: '0.04em' }}>Autonomous Interviews. Human Results.</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                {['LinkedIn', 'Twitter'].map(s => (
                  <a key={s} href="#" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#888880', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#d96424'}
                    onMouseLeave={e => e.currentTarget.style.color = '#888880'}
                  >{s}</a>
                ))}
              </div>
            </div>
            <div className="footer-right" style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#555550', marginBottom: 6 }}>interviehire.com</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#555550', marginBottom: 6 }}>interviehire@gmail.com</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#444440', marginTop: 16 }}>© 2025 intervieHire. All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

  );
};
