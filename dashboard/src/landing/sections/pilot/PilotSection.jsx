'use client';
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, PILOT_TRUST_BADGES } from '../../constants';

const Sparkle = ({ delay, x, y, size }) => (
  <div className="bd-sparkle" style={{
    left: `${x}%`, top: `${y}%`, width: size, height: size,
    animationDelay: `${delay}s`,
  }} />
);

export function PilotSection() {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [company,   setCompany]   = useState('');
  const [role,      setRole]      = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (!submitted) return;
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(false);
          setName('');
          setEmail('');
          setCompany('');
          setRole('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = {
    fontSize: 'clamp(13px, 1.2vw, 15px)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(45,212,191,0.15)',
    borderRadius: 12,
    padding: 'clamp(12px, 1.4vw, 14px) clamp(14px, 1.8vw, 16px)',
    color: '#F5F0E8', outline: 'none',
    transition: 'border-color 0.2s', width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    fontWeight: 600,
    color: '#888880',
    letterSpacing: '0.02em',
  };

  const fields = [
    { label: 'Full Name', type: 'text', placeholder: 'Devasri Bali', value: name, setter: setName },
    { label: 'Work Email', type: 'email', placeholder: 'devasri@company.com', value: email, setter: setEmail, required: true },
    { label: 'Company / Startup', type: 'text', placeholder: 'intervieHire', value: company, setter: setCompany },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="bd-glow bd-glow--center" />
      <div className="bd-glow bd-glow--br" />
      <div className="bd-glow bd-glow--bl" />
      <Sparkle delay={0}   x={10} y={15} size={3} />
      <Sparkle delay={0.8} x={88} y={22} size={4} />
      <Sparkle delay={1.5} x={15} y={72} size={3} />
      <div style={{ position: 'relative', zIndex: 5, width: '100%', padding: 'clamp(40px, 5vh, 80px) clamp(24px, 4vw, 48px)' }}>
        <div style={{ display: 'flex', gap: 'clamp(24px, 3.5vw, 48px)', alignItems: 'center', maxWidth: 1050, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 320px', minWidth: 280, opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(-30px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 18 }}>Ready to Hire <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Decisively?</span></h2>
            <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#888880', whiteSpace: 'nowrap', lineHeight: 1.55, marginBottom: 24 }}>Get started with a free pilot and see the feedback depth yourself.</p>
            <div style={{ display: 'flex', gap: 'clamp(16px, 2.2vw, 28px)', marginBottom: 24, opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(-20px)', transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
              {PILOT_TRUST_BADGES.map((s, i) => (<div key={i} style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700, color: '#2dd4bf' }}>{s.num}</div><div style={{ fontSize: 11, color: '#666660', marginTop: 3, whiteSpace: 'nowrap' }}>{s.label}</div></div>))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: loaded ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 1.6vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>{CONTACT_INFO.email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 1.6vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>{CONTACT_INFO.website}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 1.6vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>Co-Founders: {CONTACT_INFO.founders}</span></div>
            </div>
          </div>
          <div style={{ flex: '0 1 400px', minWidth: 300, width: '100%', opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(30px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
            <div style={{ marginTop: 65, background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(45,212,191,0.1)', borderRadius: 22, padding: 'clamp(24px, 3vw, 32px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fields.map(({ label, type, placeholder, value, setter, required }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      required={required}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={labelStyle}>Role Details (Optional)</label>
                  <textarea
                    placeholder="Tell us about the roles you're hiring for."
                    rows={2}
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                    onBlur={e => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                  />
                </div>
                <button type="submit" id="bd-submit-btn" style={{
                  fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                  background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: 'clamp(13px, 1.8vw, 16px) clamp(18px, 2.8vw, 24px)',
                  cursor: 'pointer', marginTop: 6, transition: 'opacity 0.2s',
                }} onMouseEnter={e => e.target.style.opacity = '0.9'} onMouseLeave={e => e.target.style.opacity = '1'}>
                  Request Pilot and Demo
                </button>
                {submitted && <div style={{ color: '#22c55e', textAlign: 'center', fontSize: 13, lineHeight: 1.5 }}><div style={{ fontWeight: 600, fontSize: 14 }}>Request submitted!</div><div style={{ color: '#888880', marginTop: 4 }}>Our team will reach out to you shortly.</div><div style={{ color: '#2dd4bf', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>Resetting in {countdown}s</div></div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
