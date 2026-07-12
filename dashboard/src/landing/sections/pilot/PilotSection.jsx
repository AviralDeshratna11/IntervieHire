'use client';
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, PILOT_TRUST_BADGES } from '../../constants';

const Sparkle = ({ delay, x, y, size }) => (
  <div className="bd-sparkle" style={{
    left: `%`, top: `%`, width: size, height: size,
    animationDelay: `s`,
  }} />
);

export function PilotSection() {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [company,   setCompany]   = useState('');
  const [role,      setRole]      = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = {
    fontSize: 'clamp(13px, 1.2vw, 15px)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(217,100,36,0.15)',
    borderRadius: 12,
    padding: 'clamp(12px, 1.5vw, 14px) clamp(14px, 2vw, 18px)',
    color: '#F5F0E8', outline: 'none',
    transition: 'border-color 0.2s', width: '100%',
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div className="bd-glow bd-glow--center" />
      <div className="bd-glow bd-glow--br" />
      <div className="bd-glow bd-glow--bl" />
      <Sparkle delay={0}   x={10} y={15} size={3} />
      <Sparkle delay={0.8} x={88} y={22} size={4} />
      <Sparkle delay={1.5} x={15} y={72} size={3} />
      <div style={{ flex: 1, position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(120px, 14vh, 160px) clamp(32px, 6vw, 80px)' }}>
        <div style={{ display: 'flex', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start', maxWidth: 1100, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 320px', minWidth: 280, opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(-30px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>Ready to Hire <span style={{ background: 'linear-gradient(90deg, #d96424, #8a3a10)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Decisively?</span></h2>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: '#888880', maxWidth: 440, lineHeight: 1.65, marginBottom: 'clamp(24px, 3vh, 36px)' }}>Get started with a free pilot and see the feedback depth yourself.</p>
            <div style={{ display: 'flex', gap: 'clamp(16px, 2.5vw, 32px)', marginBottom: 32, opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(-20px)', transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
              {PILOT_TRUST_BADGES.map((s, i) => (<div key={i} style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 700, color: '#d96424' }}>{s.num}</div><div style={{ fontSize: 11, color: '#666660', marginTop: 3, whiteSpace: 'nowrap' }}>{s.label}</div></div>))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: loaded ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>{CONTACT_INFO.email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>{CONTACT_INFO.website}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#F5F0E8', fontWeight: 500 }}>Co-Founders: {CONTACT_INFO.founders}</span></div>
            </div>
          </div>
          <div style={{ flex: '0 1 420px', minWidth: 300, width: '100%', opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(30px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
            <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(217,100,36,0.1)', borderRadius: 24, padding: 'clamp(24px, 3vh, 32px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2vw, 18px)' }}>
                {[{ label: 'Full Name', type: 'text', placeholder: 'Devasri Bali', value: name, setter: setName }, { label: 'Work Email', type: 'email', placeholder: 'devasri@company.com', value: email, setter: setEmail, required: true }, { label: 'Company / Startup', type: 'text', placeholder: 'intervieHire', value: company, setter: setCompany }].map(({ label, type, placeholder, value, setter, required }) => (<div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><label style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 600, color: '#888880' }}>{label}</label><input type={type} placeholder={placeholder} value={value} onChange={e => setter(e.target.value)} required={required} style={inputStyle} onFocus={e => e.target.style.borderColor = '#d96424'} onBlur={e => e.target.style.borderColor = 'rgba(217,100,36,0.15)'} /></div>))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><label style={{ fontSize: 14, fontWeight: 600, color: '#888880' }}>Role Details (Optional)</label><textarea placeholder='Tell us about the roles...' rows={3} value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, resize: 'none' }} onFocus={e => e.target.style.borderColor = '#d96424'} onBlur={e => e.target.style.borderColor = 'rgba(217,100,36,0.15)'} /></div>
                <button type='submit' id='bd-submit-btn' style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(90deg, #d96424, #8a3a10)', color: '#fff', border: 'none', borderRadius: 12, padding: 'clamp(14px, 2vw, 16px) clamp(20px, 3vw, 24px)', cursor: 'pointer', marginTop: 4, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = '0.9'} onMouseLeave={e => e.target.style.opacity = '1'}>Request Pilot and Demo</button>
                {submitted && <div style={{ color: '#22c55e', textAlign: 'center', fontWeight: 600, fontSize: 14 }}>Request submitted!</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
