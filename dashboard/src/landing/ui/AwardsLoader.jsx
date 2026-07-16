'use client';
import React from 'react';

export const AwardsLoader = () => (
  <div className="al-wrap">
    {/* Subtle dot grid background */}
    <div className="al-grid" />

    {/* Animated geometric rings */}
    <div className="al-rings">
      <div className="al-ring al-ring--outer" />
      <div className="al-ring al-ring--mid" />
      <div className="al-ring al-ring--inner" />
    </div>

    {/* Floating orbs */}
    <div className="al-orb al-orb--1" />
    <div className="al-orb al-orb--2" />
    <div className="al-orb al-orb--3" />

    {/* Dancing glow dots */}
    <div className="al-dot al-dot--1" />
    <div className="al-dot al-dot--2" />
    <div className="al-dot al-dot--3" />
    <div className="al-dot al-dot--4" />
    <div className="al-dot al-dot--5" />
    <div className="al-dot al-dot--6" />
    <div className="al-dot al-dot--7" />
    <div className="al-dot al-dot--8" />
    <div className="al-dot al-dot--9" />
    <div className="al-dot al-dot--10" />
    <div className="al-dot al-dot--11" />
    <div className="al-dot al-dot--12" />
    <div className="al-dot al-dot--13" />
    <div className="al-dot al-dot--14" />
    <div className="al-dot al-dot--15" />
    <div className="al-dot al-dot--16" />
    <div className="al-dot al-dot--17" />
    <div className="al-dot al-dot--18" />
    <div className="al-dot al-dot--19" />
    <div className="al-dot al-dot--20" />
    <div className="al-dot al-dot--21" />
    <div className="al-dot al-dot--22" />
    <div className="al-dot al-dot--23" />
    <div className="al-dot al-dot--24" />
    <div className="al-dot al-dot--25" />

    <div className="al-content">
      <div className="al-logo-row">
        <span className="al-logo al-logo--light">intervie</span>
        <span className="al-logo al-logo--accent">Hire</span>
      </div>

      {/* Minimal loading bar */}
      <div className="al-bar-track">
        <div className="al-bar-fill" />
      </div>

      {/* Tagline */}
      <div className="al-tagline">One platform. Every layer of hiring, handled</div>
    </div>

    <style>{`
      .al-wrap {
        min-height: 100vh;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      /* ── Dot grid ── */
      .al-grid {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
        background-size: 32px 32px;
        animation: alGridFade 2s ease-out forwards;
      }

      /* ── Rings ── */
      .al-rings {
        position: absolute;
        width: 420px;
        height: 420px;
        animation: alRingsEnter 1.5s cubic-bezier(0.16,1,0.3,1) 0s forwards;
        opacity: 0;
      }

      .al-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 1px solid transparent;
        animation: alRingSpin 8s linear infinite;
      }

      .al-ring--outer {
        border-image: linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.08), rgba(45,212,191,0.15)) 1;
        animation-duration: 12s;
      }

      .al-ring--mid {
        inset: 40px;
        border-image: linear-gradient(225deg, rgba(45,212,191,0.1), rgba(45,212,191,0.05), rgba(45,212,191,0.1)) 1;
        animation-duration: 8s;
        animation-direction: reverse;
      }

      .al-ring--inner {
        inset: 80px;
        border-image: linear-gradient(45deg, rgba(45,212,191,0.12), rgba(45,212,191,0.06), rgba(45,212,191,0.12)) 1;
        animation-duration: 6s;
      }

      /* ── Floating orbs ── */
      .al-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        pointer-events: none;
        animation: alOrbFloat 6s ease-in-out infinite;
      }

      .al-orb--1 {
        width: 300px;
        height: 300px;
        background: rgba(45,212,191,0.06);
        top: -10%;
        left: -5%;
        animation-delay: 0s;
      }

      .al-orb--2 {
        width: 250px;
        height: 250px;
        background: rgba(45,212,191,0.04);
        bottom: -5%;
        right: -5%;
        animation-delay: 2s;
      }

      .al-orb--3 {
        width: 200px;
        height: 200px;
        background: rgba(45,212,191,0.03);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 4s;
      }

      /* ── Content ── */
      .al-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        position: relative;
        z-index: 2;
        animation: alContentIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both;
      }

      .al-logo-row {
        font-family: Outfit, sans-serif;
        font-size: clamp(40px, 8vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1;
        filter: blur(4px);
        animation: alLogoBlurIn 1s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
      }
      .al-logo--light { color: #F5F0E8; }
      .al-logo--accent {
        color: #2dd4bf;
        background: none;
        -webkit-background-clip: unset;
        -webkit-text-fill-color: unset;
        background-clip: unset;
        animation: none;
      }

      /* ── Loading bar ── */
      .al-bar-track {
        width: 200px;
        height: 2px;
        background: rgba(255,255,255,0.06);
        border-radius: 2px;
        overflow: hidden;
        opacity: 0;
        animation: alFadeUp 0.6s ease 0.8s forwards;
      }

      .al-bar-fill {
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #2dd4bf, #2dd4bf, #2dd4bf);
        background-size: 200% 100%;
        border-radius: 2px;
        animation: alBarFill 2.4s cubic-bezier(0.25,0.46,0.45,0.94) 0.8s forwards,
                   alBarShimmer 1.5s linear 0.8s infinite;
      }

      /* ── Tagline ── */
      .al-tagline {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        color: rgba(255,255,255,0.2);
        letter-spacing: 0.03em;
        font-weight: 300;
        opacity: 0;
        animation: alTaglineIn 1s cubic-bezier(0.16,1,0.3,1) 1.6s forwards;
      }

      /* ── Keyframes ── */
      @keyframes alGridFade {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @keyframes alRingsEnter {
        0% { opacity: 0; transform: scale(0.6) rotate(30deg); }
        100% { opacity: 1; transform: scale(1) rotate(0); }
      }

      /* ── Dancing glow dots ── */
      .al-dot {
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: rgba(45,212,191,0.7);
        box-shadow: 0 0 8px rgba(45,212,191,0.5), 0 0 20px rgba(45,212,191,0.2);
        pointer-events: none;
        animation: alDotDance 5s ease-in-out infinite;
      }
      .al-dot--1  { top: 8%;  left: 12%; width: 3px;  height: 3px;  animation-delay: 0s;    animation-duration: 5.2s; }
      .al-dot--2  { top: 15%; left: 85%; width: 2px;  height: 2px;  animation-delay: 0.3s;  animation-duration: 4.8s; }
      .al-dot--3  { top: 25%; left: 45%; width: 4px;  height: 4px;  animation-delay: 0.7s;  animation-duration: 6.1s; }
      .al-dot--4  { top: 35%; left: 5%;  width: 2px;  height: 2px;  animation-delay: 1.1s;  animation-duration: 5.5s; }
      .al-dot--5  { top: 42%; left: 75%; width: 3px;  height: 3px;  animation-delay: 0.5s;  animation-duration: 4.3s; }
      .al-dot--6  { top: 50%; left: 92%; width: 2px;  height: 2px;  animation-delay: 1.4s;  animation-duration: 5.8s; }
      .al-dot--7  { top: 58%; left: 30%; width: 4px;  height: 4px;  animation-delay: 0.9s;  animation-duration: 4.6s; }
      .al-dot--8  { top: 65%; left: 60%; width: 2px;  height: 2px;  animation-delay: 1.8s;  animation-duration: 5.3s; }
      .al-dot--9  { top: 72%; left: 18%; width: 3px;  height: 3px;  animation-delay: 0.1s;  animation-duration: 5.9s; }
      .al-dot--10 { top: 78%; left: 82%; width: 2px;  height: 2px;  animation-delay: 0.6s;  animation-duration: 4.1s; }
      .al-dot--11 { top: 85%; left: 40%; width: 3px;  height: 3px;  animation-delay: 1.6s;  animation-duration: 5.7s; }
      .al-dot--12 { top: 92%; left: 70%; width: 2px;  height: 2px;  animation-delay: 0.2s;  animation-duration: 4.9s; }
      .al-dot--13 { top: 5%;  left: 55%; width: 2px;  height: 2px;  animation-delay: 1.3s;  animation-duration: 6.2s; }
      .al-dot--14 { top: 20%; left: 25%; width: 3px;  height: 3px;  animation-delay: 0.8s;  animation-duration: 5.1s; }
      .al-dot--15 { top: 30%; left: 68%; width: 2px;  height: 2px;  animation-delay: 1.9s;  animation-duration: 4.5s; }
      .al-dot--16 { top: 45%; left: 50%; width: 4px;  height: 4px;  animation-delay: 0.4s;  animation-duration: 5.4s; }
      .al-dot--17 { top: 55%; left: 10%; width: 2px;  height: 2px;  animation-delay: 1.2s;  animation-duration: 6s;   }
      .al-dot--18 { top: 62%; left: 88%; width: 3px;  height: 3px;  animation-delay: 0.15s; animation-duration: 4.7s; }
      .al-dot--19 { top: 75%; left: 52%; width: 2px;  height: 2px;  animation-delay: 0.55s; animation-duration: 5.6s; }
      .al-dot--20 { top: 88%; left: 15%; width: 3px;  height: 3px;  animation-delay: 1.7s;  animation-duration: 4.4s; }
      .al-dot--21 { top: 10%; left: 38%; width: 2px;  height: 2px;  animation-delay: 0.95s; animation-duration: 5.0s; }
      .al-dot--22 { top: 40%; left: 95%; width: 3px;  height: 3px;  animation-delay: 1.5s;  animation-duration: 6.3s; }
      .al-dot--23 { top: 70%; left: 72%; width: 2px;  height: 2px;  animation-delay: 0.35s; animation-duration: 4.2s; }
      .al-dot--24 { top: 48%; left: 20%; width: 4px;  height: 4px;  animation-delay: 0.75s; animation-duration: 5.8s; }
      .al-dot--25 { top: 95%; left: 48%; width: 2px;  height: 2px;  animation-delay: 1.05s; animation-duration: 4.9s; }

      @keyframes alRingSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes alOrbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -20px) scale(1.05); }
        66% { transform: translate(-20px, 15px) scale(0.95); }
      }

      @keyframes alContentIn {
        0% { opacity: 0; transform: translateY(40px) scale(0.96); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes alLogoBlurIn {
        0% { filter: blur(12px); transform: scale(0.92); }
        100% { filter: blur(0); transform: scale(1); }
      }

      @keyframes alBarFill {
        0% { width: 0; }
        60% { width: 72%; }
        85% { width: 78%; }
        100% { width: 92%; }
      }

      @keyframes alBarShimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      @keyframes alDotDance {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
        20% { transform: translate(12px, -18px) scale(1.3); opacity: 1; }
        40% { transform: translate(-8px, 14px) scale(0.9); opacity: 0.5; }
        60% { transform: translate(16px, 10px) scale(1.1); opacity: 0.8; }
        80% { transform: translate(-14px, -8px) scale(0.8); opacity: 0.4; }
      }

      @keyframes alTaglineIn {
        0% { opacity: 0; transform: translateY(8px); filter: blur(4px); }
        100% { opacity: 1; transform: translateY(0); filter: blur(0); }
      }

      @keyframes alFadeUp {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);
