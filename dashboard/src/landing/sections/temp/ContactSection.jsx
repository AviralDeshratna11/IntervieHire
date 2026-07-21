'use client';
import React from 'react';

export const ContactSection = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setCompany('');
      setNotes('');
      setSuccess(false);
    }, 3000);
  };

  return (
    <section id="contact" style={{ 
      background: '#0F0D07', 
      padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 48px)', 
      position: 'relative', 
      overflow: 'hidden',
      borderTop: '1px solid rgba(45,212,191, 0.08)'
    }}>
      {/* Background Radial Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 500, background: 'radial-gradient(ellipse, rgba(45,212,191,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(32px, 5vw, 60px)',
          alignItems: 'start'
        }}>
          {/* Left Side: Info */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: 100,
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              background: 'rgba(45,212,191, 0.1)',
              border: '1px solid rgba(45,212,191, 0.2)',
              color: '#2dd4bf',
              marginBottom: 20
            }}>
              Join the Pilot
            </div>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#EEEEEE',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 24
            }}>
              Ready to Hire <span style={{
                background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Decisively?</span>
            </h2>
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: '#888880',
              lineHeight: 1.65,
              marginBottom: 48,
              maxWidth: 480
            }}>
              Get started with a free pilot. Have our industry experts interview your next round of applicants for free and see the feedback depth yourself.
            </p>

            {/* Details Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Detail 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#2dd4bf', display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#EEEEEE', fontWeight: 500 }}>interviehire@gmail.com</span>
              </div>
              {/* Detail 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#2dd4bf', display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#EEEEEE', fontWeight: 500 }}>interviehire.com</span>
              </div>
              {/* Detail 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#2dd4bf', display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)', color: '#EEEEEE', fontWeight: 500 }}>Co-Founders: Devasri Bali & Aditya Rana</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form (Glass Card) */}
          <div style={{
            background: 'rgba(15, 15, 18, 0.6)',
            border: '1px solid rgba(45,212,191, 0.1)',
            borderRadius: 24,
            padding: 'clamp(24px, 4vw, 40px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 3vw, 24px)' }}>
              {/* Form Input 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600, color: '#888880' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Devasri Bali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,212,191,0.15)',
                    borderRadius: 12, padding: 'clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 18px)', color: '#EEEEEE', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                />
              </div>

              {/* Form Input 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600, color: '#888880' }}>Work Email</label>
                <input
                  type="email"
                  placeholder="devasri@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,212,191,0.15)',
                    borderRadius: 12, padding: 'clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 18px)', color: '#EEEEEE', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                />
              </div>

              {/* Form Input 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600, color: '#888880' }}>Company / Startup</label>
                <input
                  type="text"
                  placeholder="intervieHire"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,212,191,0.15)',
                    borderRadius: 12, padding: 'clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 18px)', color: '#EEEEEE', outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                />
              </div>

              {/* Form Input 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600, color: '#888880' }}>Role Details (Optional)</label>
                <textarea
                  placeholder="Tell us about the roles you are looking to hire for..."
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,212,191,0.15)',
                    borderRadius: 12, padding: 'clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 18px)', color: '#EEEEEE', outline: 'none',
                    resize: 'none', transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2dd4bf'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(45,212,191,0.15)'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700,
                  background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)', color: '#fff',
                  border: 'none', borderRadius: 12, padding: 'clamp(14px, 2.5vw, 16px) clamp(20px, 4vw, 24px)', cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Request Pilot & Demo
              </button>

              {success && (
                <div style={{ color: '#22c55e', textAlign: 'center', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                  ✓ Request submitted! Our team will reach out shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
