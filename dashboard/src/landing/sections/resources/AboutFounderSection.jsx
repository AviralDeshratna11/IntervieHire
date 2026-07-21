'use client';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, FOUNDER_TEAM } from '../../constants';

const T = {
  bg:     COLORS.dark,
  card:   COLORS.darkAlt,
  white:  COLORS.white,
  muted:  '#9aaab8',
  gold:   COLORS.gold,
  pink:   COLORS.gold,
  orange: COLORS.gold
};

const FounderCard = ({ name, role, bio, image, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
      transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`
    }}>
      <div style={{
        aspectRatio: '1/1', borderRadius: 20, overflow: 'hidden',
        border: '1px solid rgba(45,212,191,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
      </div>
      <div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: T.white, lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(12px,1.6vw,13px)', fontWeight: 600, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{role}</div>
        <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(13px,1.8vw,14px)', color: T.muted, lineHeight: 1.6, marginTop: 10 }}>{bio}</p>
      </div>
    </div>
  );
};

const TeamCard = ({ name, role, img, idx }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: T.card, borderRadius: 16, border: '1px solid rgba(45,212,191,0.06)',
      overflow: 'hidden', cursor: 'pointer',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s`
    }}>
      <div style={{ aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(14px,1.8vw,15px)', fontWeight: 700, color: T.white }}>{name}</div>
        <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(11px,1.6vw,12px)', color: T.muted, marginTop: 2 }}>{role}</div>
      </div>
    </div>
  );
};

export const AboutFounderSection = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Golden cut-line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 20,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191,0.55), 0 4px 80px rgba(45,212,191,0.18)',
      }} />



      {/* â”€â”€ Section 2: Letter from the Founders â”€â”€ */}
      <section data-scroll style={{ background: T.bg, padding: 'clamp(80px,10vw,140px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '10px 24px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: T.gold
            }}>
              <span style={{ color: T.white }}>A Letter from the Founders</span>
            </div>
            <div style={{ height: 16 }} />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 700, color: T.white, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Why We Built{' '}
              <span style={{
                background: 'linear-gradient(135deg, #2dd4bf, #64a0dc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>IntervieHire.</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(15px,2vw,17px)', color: T.muted, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
            <p style={{ margin: 0, textAlign: 'center' }}>
              We&rsquo;re Devasri Bali and Aditya Pratap Rana, and IntervieHire wasn&rsquo;t born in a boardroom. It started at BITS Pilani, where we met as students and worked together across multiple projects. One of our biggest responsibilities was hiring for the Society of Student Mess Services (SSMS), where we experienced firsthand how exhausting recruitment could be. Later, during our internships at fast-growing startups, hiring became part of our everyday work again. No matter where we were, the challenges remained the same. Hundreds of resumes to review, endless screening calls, interview scheduling, inconsistent evaluations, and great candidates getting lost before they even had a chance to speak.
            </p>
            <p style={{ margin: 0, textAlign: 'center' }}>
              The more we hired, the more we realized the problem wasn&rsquo;t a lack of talent. It was the hiring process itself. Devasri brought an analytical approach shaped by product building and quantitative trading at Futures First, while Aditya brought years of operational experience and a systems-first mindset. Having worked together throughout college, we knew we complemented each other well, and we decided to solve one of the biggest problems we had repeatedly faced ourselves.
            </p>
            <p style={{ margin: 0, textAlign: 'center' }}>
              We don&rsquo;t believe AI should replace recruiters. We believe it should eliminate the repetitive work that keeps recruiters away from what actually matters. Reading hundreds of resumes, asking the same screening questions, coordinating interviews, and manually comparing candidates shouldn&rsquo;t consume the hiring process. Recruiters should spend their time building relationships, understanding people, and making confident hiring decisions.
            </p>
            <p style={{ margin: 0, textAlign: 'center' }}>
              That&rsquo;s why we built IntervieHire. A platform that sources candidates, shortlists resumes, conducts AI-powered interviews, prevents cheating, and delivers structured hiring insights, helping companies hire faster, reduce costs, and never miss exceptional talent because of manual screening. We believe every qualified candidate deserves a fair opportunity, every recruiter deserves their time back, and every hiring decision should be backed by meaningful insights instead of guesswork.
            </p>
            <p style={{ margin: 0, textAlign: 'center' }}>
              Thank you for being part of our journey.
            </p>
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(15px,2vw,17px)', fontWeight: 700, color: T.white }}>Devasri Bali &amp; Aditya Pratap Rana</p>
              <p style={{ margin: 0, fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(13px,1.6vw,14px)', color: T.gold, letterSpacing: '0.02em' }}>Co-founders, IntervieHire</p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Section 3: Meet the Founders â”€â”€ */}
      <section data-scroll style={{ background: T.bg, padding: 'clamp(30px,4vw,50px) clamp(16px,4vw,48px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '6px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: T.gold
            }}>
              Meet the Founders
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 700, color: T.white, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              The People Behind the Mission.
            </h2>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src="/about.jpeg" alt="Devasri Bali & Aditya Pratap Rana" style={{ width: '100%', maxWidth: 400, borderRadius: 20, border: '1px solid rgba(45,212,191,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            <p style={{ margin: '16px 0 0', fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(16px,2.2vw,20px)', fontWeight: 700, color: T.white }}>Devasri Bali &amp; Aditya Pratap Rana</p>
            <p style={{ margin: '2px 0 0', fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(13px,1.6vw,14px)', color: T.gold, letterSpacing: '0.02em' }}>Co-founders, IntervieHire</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'clamp(32px,5vw,48px)' }}>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(14px,1.8vw,16px)', color: T.muted, lineHeight: 1.6, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
              "We started IntervieHire to build the autonomous hiring layer of the web â€” eliminating bias and saving thousands of engineering hours."
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ Section 3: Meet the Team â”€â”€ */}
      <section data-scroll style={{ background: T.bg, padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '6px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: T.gold
            }}>
              Our Team
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 700, color: T.white, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Meet the People Who Build It.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
            {FOUNDER_TEAM.map((m, i) => <TeamCard key={i} {...m} idx={i} />)}
          </div>
        </div>
      </section>


    </div>
  );
};
