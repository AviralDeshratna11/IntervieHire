'use client';
import React from 'react';

/**
 * BookDemoCtaSection
 *
 * Full-width call-to-action section prompting visitors to book a demo.
 * Used at the bottom of the homepage (LandingApp) and can be reused
 * on any landing page that needs an orange CTA closer.
 */
export function BookDemoCtaSection() {
  return (
    <section
      data-scroll
      style={{
        background: '#000',
        padding: 'clamp(80px,10vw,140px) clamp(16px,4vw,48px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(217,100,36,0.08)',
      }}
    >
      {/* Radial ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(217,100,36,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating sparkles */}
      <div className="bdcta-sparkle bdcta-sparkle--1" />
      <div className="bdcta-sparkle bdcta-sparkle--2" />
      <div className="bdcta-sparkle bdcta-sparkle--3" />
      <div className="bdcta-sparkle bdcta-sparkle--4" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="bdcta-heading">
          Ready to{' '}
          <span style={{
            background: 'linear-gradient(90deg, #d96424, #ba5520)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            join us?
          </span>
        </h2>

        <p className="bdcta-subtext">
          Start hiring smarter with AI-powered interviews and built-in integrity checks.
        </p>

        <button
          id="bdcta-book-demo-btn"
          onClick={() => window.location.href = '/book-demo'}
          className="bdcta-btn"
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 0 45px rgba(217,100,36,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(217,100,36,0.25)';
          }}
        >
          Book a Demo &rarr;
        </button>
      </div>

      <style>{`
        .bdcta-sparkle {
          position: absolute;
          border-radius: 50%;
          background: #d96424;
          pointer-events: none;
        }
        .bdcta-sparkle--1 { top: 15%; left: 8%; width: 6px; height: 6px; box-shadow: 0 0 12px rgba(217,100,36,0.6); animation: bdctaSparkle1 3s ease-in-out infinite 0.5s; }
        .bdcta-sparkle--2 { bottom: 20%; right: 5%; width: 8px; height: 8px; box-shadow: 0 0 10px rgba(217,100,36,0.5); animation: bdctaSparkle2 4s ease-in-out infinite 1s; }
        .bdcta-sparkle--3 { top: 30%; right: 12%; width: 4px; height: 4px; box-shadow: 0 0 8px rgba(217,100,36,0.5); animation: bdctaSparkle1 3.5s ease-in-out infinite 0.8s; }
        .bdcta-sparkle--4 { bottom: 40%; left: 4%; width: 5px; height: 5px; box-shadow: 0 0 10px rgba(217,100,36,0.5); animation: bdctaSparkle2 2.8s ease-in-out infinite 0.3s; }

        .bdcta-heading {
          font-family: Outfit, sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 700;
          color: #F5F0E8;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 auto 16px;
          max-width: 600px;
          opacity: 0;
          animation: bdctaReveal 1s cubic-bezier(0.16,1,0.3,1) 0s forwards;
        }
        .bdcta-subtext {
          font-size: clamp(14px, 1.6vw, 16px);
          color: #888880;
          max-width: 480px;
          margin: 0 auto 32px;
          line-height: 1.6;
          opacity: 0;
          animation: bdctaReveal 1s cubic-bezier(0.16,1,0.3,1) 0.15s forwards;
        }
        .bdcta-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #d96424, #ba5520);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 16px 36px;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(217,100,36,0.25);
          opacity: 0;
          animation: bdctaReveal 1s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        @keyframes bdctaReveal {
          0%   { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes bdctaSparkle1 {
          0%, 100% { opacity: 0.2; transform: scale(0.5) translate(0, 0); }
          50%       { opacity: 1;   transform: scale(1.2) translate(10px, -15px); }
        }
        @keyframes bdctaSparkle2 {
          0%, 100% { opacity: 0.2; transform: scale(0.5) translate(0, 0); }
          50%       { opacity: 1;   transform: scale(1.4) translate(-8px, 10px); }
        }
      `}</style>
    </section>
  );
}
