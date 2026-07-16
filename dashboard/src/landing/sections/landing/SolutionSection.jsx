'use client';
import React from 'react';
import { useMediaQuery } from '../../hooks';

import { SOLUTION_CARDS } from '../../constants';

const cards = SOLUTION_CARDS;


const SeeAllFeaturesCTA = () => {
  const ctaRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ctaRef}
      style={{
        textAlign: 'center',
        padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 48px) clamp(16px, 2vw, 30px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
      }}
    >
      {/* Subtle glow behind the block */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 200,
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Kicker line */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        marginBottom: 20,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s 0.15s, transform 0.7s 0.15s',
      }}>
        <div style={{ width: 28, height: 1, background: 'rgba(45,212,191,0.4)' }} />
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#2dd4bf',
          fontWeight: 600,
        }}>5 capabilities. One platform.</span>
        <div style={{ width: 28, height: 1, background: 'rgba(45,212,191,0.4)' }} />
      </div>

      {/* Headline */}
      <h3 style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
        fontWeight: 700,
        color: '#EEEEEE',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        margin: '0 0 10px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s 0.25s, transform 0.7s 0.25s',
      }}>
        There's a lot more under the hood.
      </h3>

      {/* Sub-line */}
      <p style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(14px, 1.6vw, 16px)',
        color: '#888880',
        margin: '0 0 36px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
      }}>
        Dive into every feature — from AI resume parsing to expert panel analytics.
      </p>

      {/* Button */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: 'opacity 0.7s 0.45s, transform 0.7s 0.45s',
        display: 'inline-block',
      }}>
        <a
          href="/features"
          className="sol-cta-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 32px',
            borderRadius: 999,
            background: '#2dd4bf',
            color: '#000000',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
            boxShadow: '0 0 20px rgba(45,212,191,0.25), 0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>Explore All Features</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'relative', zIndex: 2 }}>
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <style>{`
          .sol-cta-btn::after {
            content: ''; position: absolute; inset: 0; border-radius: 999px;
            background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
            background-size: 200% 100%;
            opacity: 0; transition: opacity 0.3s ease;
          }
          .sol-cta-btn:hover {
            transform: scale(1.05) translateY(-1px);
            box-shadow: 0 0 45px rgba(45,212,191,0.6), 0 8px 24px rgba(0,0,0,0.4);
          }
          .sol-cta-btn:hover::after {
            opacity: 1;
            animation: solBtnShine 0.8s ease;
          }
          @keyframes solBtnShine {
            0% { background-position: 200% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>
      </div>


    </div>
  );
};

export const SolutionSection = () => {
  const sectionRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  React.useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      
      // Calculate active index discretely (5 cards = 0.2 width zones)
      const idx = Math.min(cards.length - 1, Math.floor(p / 0.2));
      setActiveIndex(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSlideChange = (index) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalHeight = sectionRef.current.offsetHeight - window.innerHeight;
    const sectionTop = (window.__lenis?.scroll ?? 0) + rect.top;
    
    const targetProgress = index * 0.2 + 0.1;
    const targetScroll = sectionTop + targetProgress * totalHeight;
    
    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % cards.length;
    handleSlideChange(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + cards.length) % cards.length;
    handleSlideChange(prevIdx);
  };

  const activeCard = cards[activeIndex];

  const getCardStyles = (i, activeIdx) => {
    if (i === activeIdx) {
      return {
        x: 0,
        percent: false,
        scale: 1,
        opacity: 1,
        zIndex: 10 + i,
      };
    }
    if (i < activeIdx) {
      // Covered cards: shift left and fade
      return {
        x: -40,
        percent: false,
        scale: 0.96,
        opacity: 0,
        zIndex: 5,
      };
    }
    // Incoming cards: off-screen right
    return {
      x: 100,
      percent: true,
      scale: 1,
      opacity: 0,
      zIndex: 10 + i,
    };
  };

  // MacBook Mockup Screen Contents
  const renderScreenContent = (type) => {
    switch (type) {
      case 'sourcing':
        return (
          <div style={{ padding: '10px 12px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px', flexShrink: 0 }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '11.5px' }}>Sourced Candidates</div>
              <div style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '9.5px' }}>248 candidates found</div>
            </div>

            {/* Candidate list — each row is flex:1 so they share space equally and NEVER overflow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {[
                { name: "Ananya Kapoor", exp: "5 yrs", headline: "Strategy, Analytics, Roadmaps",    company: "Google",    location: "Bangalore", match: "96% Match", pills: ["Product Strategy", "Analytics", "Roadmaps"],  active: true,  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face" },
                { name: "Rohit Verma",   exp: "4 yrs", headline: "User Research, A/B Testing, SQL",   company: "Zomato",    location: "Gurgaon",   match: "93% Match", pills: ["User Research", "A/B Testing", "SQL"],        active: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face" },
                { name: "Megha Iyer",    exp: "4 yrs", headline: "Product Ops, Metrics, JIRA",        company: "Microsoft", location: "Noida",     match: "90% Match", pills: ["Product Ops", "Metrics", "JIRA"],            active: false, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face" },
                { name: "Kunal Desai",   exp: "6 yrs", headline: "Growth, Retention, Analytics",      company: "PhonePe",   location: "Bangalore", match: "88% Match", pills: ["Growth", "Retention", "Analytics"],          active: false, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face" },
                { name: "Simran Bhatia", exp: "3 yrs", headline: "Agile, Roadmaps, Stakeholder Mgmt", company: "Swiggy",    location: "Pune",      match: "85% Match", pills: ["Agile", "Roadmaps", "Stakeholder Mgmt"],     active: false, photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face" },
              ].map((cand, idx) => (
                <div key={idx} style={{
                  background: cand.active ? 'rgba(45,212,191,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${cand.active ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '7px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                }}>
                  {/* Avatar */}
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: `1.5px solid ${cand.active ? 'rgba(45,212,191,0.5)' : 'rgba(255,255,255,0.08)'}` }}>
                    <img src={cand.photo} alt={cand.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='linear-gradient(135deg,#1f6f68,#2dd4bf)'; }}
                    />
                  </div>

                  {/* Name + meta */}
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '10px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cand.name}</div>
                    <div style={{ color: '#888880', fontSize: '8px', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cand.exp} <span style={{ color: '#444' }}>•</span> {cand.headline}
                    </div>
                    <div style={{ color: '#555550', fontSize: '7.5px', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cand.company} · {cand.location}
                    </div>
                  </div>

                  {/* Match badge + pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                    <div style={{ border: '1px solid rgba(45,212,191,0.4)', color: '#2dd4bf', borderRadius: '999px', padding: '1px 6px', fontSize: '7.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cand.match}</div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {cand.pills.map((pill, pIdx) => (
                        <span key={pIdx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', padding: '1px 4px', fontSize: '7px', color: '#CCC', whiteSpace: 'nowrap' }}>{pill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '5px', marginTop: '5px', flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#888880', fontSize: '8px' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>
                Sourcing from 15+ platforms
              </span>
              <span style={{ color: '#2dd4bf', fontSize: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                View all candidates
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </div>
          </div>
        );
      case 'resume':
        return (
          <div style={{ padding: '10px 12px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '11.5px' }}>Sourced Candidates</div>
              <div style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '9.5px' }}>312 candidates found</div>
            </div>

            {/* Candidate list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {[
                {
                  name: "Riya Singh", role: "PU LLM Engineer", exp: "3 yrs exp", skills: "Python, LLMs, LangChain, RAG",
                  match: "94% Match", iconBg: "linear-gradient(135deg, #0d5c4a 0%, #2dd4bf 100%)", iconColor: "#03110F",
                  icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
                },
                {
                  name: "Arjun Mehta", role: "Sales Executive", exp: "4 yrs exp", skills: "B2B Sales, CRM, Negotiation",
                  match: "92% Match", iconBg: "linear-gradient(135deg, #3b1f6e 0%, #8b5cf6 100%)", iconColor: "#e9d5ff",
                  icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
                },
                {
                  name: "Neha Kapoor", role: "Product Manager", exp: "5 yrs exp", skills: "Roadmaps, Analytics, Product Strategy",
                  match: "90% Match", iconBg: "linear-gradient(135deg, #1a3a5e 0%, #3b82f6 100%)", iconColor: "#bfdbfe",
                  icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>),
                },
                {
                  name: "Karan Verma", role: "Sales Development Representative", exp: "2 yrs exp", skills: "Lead Gen, Outreach, CRM",
                  match: "86% Match", iconBg: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)", iconColor: "#fed7aa",
                  icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
                },
              ].map((cand, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                }}>
                  {/* Icon Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: cand.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cand.iconColor,
                  }}>
                    {cand.icon}
                  </div>

                  {/* Name + role + skills */}
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '11px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cand.name}</div>
                    <div style={{ color: '#AAAAAA', fontSize: '9.5px', marginTop: '1px', fontWeight: 500 }}>{cand.role}</div>
                    <div style={{ color: '#555550', fontSize: '8.5px', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cand.exp} <span style={{ color: '#444' }}>•</span> {cand.skills}
                    </div>
                  </div>

                  {/* Match badge */}
                  <div style={{
                    border: '1px solid rgba(45,212,191,0.4)',
                    color: '#2dd4bf',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontSize: '8.5px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>{cand.match}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '6px', flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#888880', fontSize: '8px' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>
                Sourcing from 15+ platforms
              </span>
              <span style={{ color: '#2dd4bf', fontSize: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                View all condidates
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </div>
          </div>
        );
      case 'screening':
        return (
          <div style={{ color: '#888880', fontSize: '11px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
            {/* Header of the call screen */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '11px' }}>Recruiter Screening Call</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8.5px', fontWeight: 600 }}>
                <span style={{ color: '#EF4444', animation: 'voiceWavePulse 1.5s infinite' }}>●</span>
                <span style={{ color: '#EF4444', letterSpacing: '0.05em' }}>LIVE</span>
                <span style={{ color: '#555550' }}>•</span>
                <span style={{ color: '#888880' }}>LINA (AI INTERVIEWER)</span>
              </div>
            </div>

            {/* Split Content columns */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Left Video Panel */}
              <div style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '6px', boxSizing: 'border-box' }}>
                <div style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                    alt="Lina"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Overlay Info bar */}
                  <div style={{
                    position: 'absolute', bottom: '4px', left: '4px', right: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '4px',
                    padding: '3px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '8.5px' }}>● Lina</span>
                      <span style={{ color: '#888880', fontSize: '7px' }}>AI Interviewer</span>
                    </div>
                    {/* Audio wave indicator */}
                    <div style={{ display: 'flex', gap: '1.5px', alignItems: 'center', height: '10px' }}>
                      {[8, 14, 10, 16, 6].map((h, i) => (
                        <div key={i} style={{
                          width: '1.5px',
                          height: `${h}px`,
                          background: '#2dd4bf',
                          borderRadius: '1px',
                          transformOrigin: 'bottom',
                          animation: 'heightPulse 1.2s infinite ease-in-out',
                          animationDelay: `${i * 0.15}s`
                        }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '5px', flexShrink: 0 }}>
                  {[
                    <svg key="mic" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
                    <svg key="video" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
                    <svg key="share" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  ].map((svgIcon, i) => (
                    <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EEEEEE', cursor: 'pointer' }}>
                      {svgIcon}
                    </div>
                  ))}
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.68 22.11a6 6 0 0 1-7.77-8.88l1.45-1.45a6 6 0 0 1 8.88 7.77l-1.45 1.45z"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                  </div>
                </div>
              </div>

              {/* Right Questions/Transcript Panel */}
              <div style={{ width: '55%', padding: '6px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
                <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '10px', marginBottom: '5px', flexShrink: 0 }}>Screening Questions</div>
                {/* Scrolling transcripts area */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', paddingRight: '2px', minHeight: 0 }}>
                  {[
                    { q: "What is your current CTC?", a: "₹12 LPA" },
                    { q: "What is your expected CTC?", a: "₹18-20 LPA" },
                    { q: "Are you currently serving a notice period?", a: "Yes, 30 days" },
                    { q: "Are you willing to relocate?", a: "Yes, I'm open to relocating" },
                    { q: "Why are you interested in this role?", a: "I'm excited about this role because it aligns with my skills and career goals. I'm looking to work on impactful projects and grow." }
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '5px', padding: '4px 6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-start', color: '#EEEEEE' }}>
                          <span style={{ color: '#2dd4bf', flexShrink: 0, marginTop: '2px' }}>
                            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '8.5px', lineHeight: 1.2 }}>{item.q}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-start', color: '#888880', paddingLeft: '10px' }}>
                        <span style={{ color: '#555550', flexShrink: 0, marginTop: '2.5px' }}>
                          <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        </span>
                        <span style={{ fontSize: '8.0px', lineHeight: 1.3 }}>{item.a}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Call Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '5px 10px', flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#888880', fontSize: '8px' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Call Duration 08:42
              </span>
              <span style={{ color: '#2dd4bf', fontSize: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                View Full Summary
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </div>
          </div>
        );
      case 'functional':
        return (
          <div style={{ color: '#888880', fontSize: '10px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, background: '#121212' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', borderRadius: '50%', background: '#f97316', color: '#FFF', fontSize: '8px', fontWeight: 'bold' }}>+</span>
                <span style={{ color: '#EEEEEE', fontWeight: 700, fontSize: '10.5px' }}>intervieHire</span>
                <span style={{ color: '#555550', fontSize: '8.5px' }}>AI INTERVIEW ROOM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px', fontSize: '7.5px', color: '#AAA' }}>
                  <span style={{ color: '#2dd4bf' }}>●</span> Functional Interview <span style={{ color: '#555' }}>|</span> ROUND 1
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '2px 6px', fontSize: '7.5px', color: '#EF4444' }}>
                  <span style={{ color: '#EF4444' }}>●</span> Proctoring Session Started
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '7.5px', color: '#555550' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20v-8M17 20V8M22 20V4M7 20v-4M2 20v-2"/></svg>
                  Excellent connection
                </span>
                <span style={{ color: '#EEEEEE', fontSize: '8.5px', fontWeight: 600 }}>00:15</span>
              </div>
            </div>

            {/* Main Area */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Left Video viewport */}
              <div style={{ width: '62%', display: 'flex', flexDirection: 'column', padding: '6px', boxSizing: 'border-box', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1, position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: '#18181A' }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
                    alt="Lina"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Overlay Top bar */}
                  <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '3px 6px', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '8px' }}>Lina</span>
                      <span style={{ color: '#888880', fontSize: '6.5px' }}>AI INTERVIEWER</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '3px 6px', borderRadius: '4px', fontSize: '7.5px', color: '#EF4444', fontWeight: 600 }}>
                      ● LIVE - AI INTERVIEWER
                    </div>
                  </div>

                  {/* Left Floating bar */}
                  <div style={{ position: 'absolute', top: '40px', left: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {['gear', 'info', 'file'].map((ico, i) => (
                      <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EEEEEE', cursor: 'pointer' }}>
                        {ico === 'gear' ? (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        ) : ico === 'info' ? (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* PIP Candidate thumbnail */}
                  <div style={{
                    position: 'absolute', bottom: '6px', right: '6px',
                    width: '65px', height: '45px', borderRadius: '4px',
                    overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&fit=crop&crop=face"
                      alt="Candidate"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '3px', left: '3px', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', borderRadius: '2px', fontSize: '6px', color: '#FFF' }}>
                      ● YOU
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 4px', flexShrink: 0 }}>
                  <span style={{ color: '#888880', fontSize: '7.5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ color: '#EF4444' }}>●</span> 00:15 ELAPSED  ·  RECORDING AUDIO + VIDEO  ·  <span style={{ color: '#2dd4bf', cursor: 'pointer' }}>Debug</span>
                  </span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[
                      <svg key="mic" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
                      <svg key="vid" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
                      <svg key="share" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    ].map((ico, idx) => (
                      <div key={idx} style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EEEEEE', cursor: 'pointer' }}>
                        {ico}
                      </div>
                    ))}
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.68 22.11a6 6 0 0 1-7.77-8.88l1.45-1.45a6 6 0 0 1 8.88 7.77l-1.45 1.45z"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel (Interaction panel) */}
              <div style={{ width: '38%', display: 'flex', flexDirection: 'column', padding: '6px', boxSizing: 'border-box', overflow: 'hidden' }}>
                <span style={{ color: '#f97316', fontWeight: 700, fontSize: '8px', letterSpacing: '0.05em' }}>FUNCTIONAL INTERVIEW</span>
                <p style={{ color: '#888880', fontSize: '7.5px', lineHeight: 1.3, margin: '2px 0 6px 0' }}>Lina will ask you in-depth functional questions based on your role, experience and problem solving approach.</p>

                {/* Progress bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', flexShrink: 0 }}>
                  <span style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '8px' }}>Question 03/08</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px', flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((tick) => (
                    <div key={tick} style={{ flex: 1, height: '2px', background: tick <= 3 ? '#2dd4bf' : 'rgba(255,255,255,0.06)', borderRadius: '1px' }} />
                  ))}
                </div>

                {/* Question scrolling transcript list */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', paddingRight: '2px', minHeight: 0 }}>
                  {[
                    { q: "Can you walk me through a recent project you worked on and your role in it?", t: "10:15 AM", active: true },
                    { q: "How did you approach solving a complex problem with unclear requirements?", t: "10:17 AM" },
                    { q: "What frameworks or tools did you use to prioritize features or tasks?", t: "10:19 AM" },
                    { q: "How do you measure the success of a project or initiative?", t: "10:21 AM" },
                    { q: "How do you handle disagreements within a team?", t: "10:23 AM" }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: item.active ? 'rgba(249,115,22,0.04)' : 'rgba(255,255,255,0.015)',
                      border: `1px solid ${item.active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '5px',
                      padding: '4px 6px',
                    }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
                        <span style={{ color: item.active ? '#f97316' : '#888880', flexShrink: 0, marginTop: '2px' }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '8px', lineHeight: 1.25 }}>{item.q}</span>
                            <span style={{ color: '#555550', fontSize: '6.5px', whiteSpace: 'nowrap' }}>{item.t}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer text + Buttons */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '5px', marginTop: '5px', flexShrink: 0 }}>
                  <div style={{ color: '#555550', fontSize: '7px', marginBottom: '4px' }}>● All responses are recorded and analyzed.</div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#EEEEEE', fontSize: '7.5px', fontWeight: 600, padding: '4px 0', cursor: 'pointer' }}>Raise Hand</button>
                    <button style={{ flex: 1, background: 'transparent', border: '1px solid #EF4444', borderRadius: '4px', color: '#EF4444', fontSize: '7.5px', fontWeight: 600, padding: '4px 0', cursor: 'pointer' }}>End Interview</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'voice':

        return (
          <div style={{ padding: '16px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
              <div style={{ fontSize: '11px', color: '#34D399', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Session Active • Live Stream</div>
              <div style={{ color: '#EEEEEE', fontSize: '14px', fontWeight: 600 }}>Behavioral Assessment #02</div>
            </div>
            
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
              <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(52,211,153,0.2)', borderRadius: '50%', animation: 'voiceWavePulse 2s infinite' }} />
              <div style={{ position: 'absolute', inset: 15, border: '1px solid rgba(52,211,153,0.4)', borderRadius: '50%' }} />
              <div style={{ width: '56px', height: '56px', background: 'radial-gradient(circle, #34D399 0%, #059669 100%)', borderRadius: '50%', boxShadow: '0 0 20px rgba(52,211,153,0.5)' }} />
            </div>

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center', height: '24px', marginTop: '12px' }}>
              {[15, 35, 20, 45, 12, 30, 25, 48, 18, 32, 10, 40].map((h, i) => (
                <div key={i} style={{ width: '3px', height: `${h}px`, background: '#34D399', borderRadius: '2px', opacity: 0.85 }} />
              ))}
            </div>

            <div style={{ marginTop: '14px', color: '#555550', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', maxWidth: '320px' }}>
              "Can you describe a challenging React project and how you solved a state-management issue?"
            </div>
          </div>
        );
      case 'code':
        return (
          <div style={{ color: '#888880', fontSize: '11px', fontFamily: 'monospace', height: '100%', display: 'flex' }}>
            <div style={{ width: '110px', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '12px' }}>
              <div style={{ color: '#555550', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '9px', marginBottom: '8px' }}>Workspace</div>
              <div style={{ color: '#38BDF8', marginBottom: '6px' }}>📁 src</div>
              <div style={{ paddingLeft: '12px', color: '#EEEEEE', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ color: '#38BDF8' }}>📄 Interview.jsx</div>
                <div>📄 App.css</div>
                <div>📄 README.md</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', marginBottom: '8px' }}>
                <div style={{ color: '#EEEEEE' }}>Interview.jsx</div>
                <div style={{ color: '#38BDF8' }}>JS / React</div>
              </div>
              <div style={{ flex: 1, color: '#38BDF8', lineHeight: '1.4' }}>
                <div><span style={{ color: '#2dd4bf' }}>import</span> React <span style={{ color: '#2dd4bf' }}>from</span> <span style={{ color: '#A5D6A7' }}>'react'</span>;</div>
                <br/>
                <div><span style={{ color: '#2dd4bf' }}>const</span> <span style={{ color: '#EEEEEE' }}>InterviewSolution</span> = () =&gt; &#123;</div>
                <div style={{ paddingLeft: '12px' }}><span style={{ color: '#2dd4bf' }}>const</span> [score, setScore] = React.useState(<span style={{ color: '#FFB300' }}>100</span>);</div>
                <div style={{ paddingLeft: '12px' }}><span style={{ color: '#2dd4bf' }}>return</span> (</div>
                <div style={{ paddingLeft: '24px' }}>&lt;<span style={{ color: '#2dd4bf' }}>div</span> className=<span style={{ color: '#A5D6A7' }}>"candidate-ide"</span>&gt;</div>
                <div style={{ paddingLeft: '12px' }}>);</div>
                <div>&#125;;</div>
              </div>
              <div style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '6px 10px', fontSize: '10px' }}>
                <div style={{ color: '#34D399' }}>✔ Test Suite Passed (4/4 cases)</div>
              </div>
            </div>
          </div>
        );
      case 'expert':
        return (
          <div style={{ padding: '16px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600 }}>Technical Round Panel: System Architecture</div>
              <div style={{ color: '#FBBF24' }}>● Live Call</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888880" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 20 C6 16 9 14 12 14 C15 14 18 16 18 20"/>
                </svg>
                <div style={{ fontSize: '10px', color: '#555550', marginTop: '6px' }}>Candidate Screen</div>
                <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', color: '#EEEEEE' }}>Sarah Chen</div>
              </div>

              <div style={{ background: 'rgba(251,191,36,0.03)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 20 C6 16 9 14 12 14 C15 14 18 16 18 20"/>
                </svg>
                <div style={{ fontSize: '10px', color: '#FBBF24', marginTop: '6px' }}>Industry Lead Partner</div>
                <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', color: '#EEEEEE' }}>Alex (ex-Google)</div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div style={{ padding: '12px 14px', color: '#888880', fontSize: '11px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
            {/* Candidate Header with Professional Image */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&fit=crop&crop=face"
                    alt="Sarah Okafor"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '11px', lineHeight: 1.1 }}>Sarah Okafor</div>
                  <div style={{ color: '#888880', fontSize: '8.5px', marginTop: '1px' }}>Senior Frontend Engineer</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '4px', padding: '2px 6px', fontSize: '8px', color: '#2dd4bf', fontWeight: 600 }}>
                Approved to Hire
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ color: '#EEEEEE', fontWeight: 600, fontSize: '9.0px' }}>Competency Breakdown</div>
                  
                  {[
                    { name: "Technical Depth", val: 94, c: "#2dd4bf" },
                    { name: "System Design", val: 88, c: "#2dd4bf" },
                    { name: "Communication", val: 90, c: "#DDDDDD" }
                  ].map((skill, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', marginBottom: '1px' }}>
                        <span>{skill.name}</span>
                        <span style={{ fontWeight: 'bold', color: '#FFF' }}>{skill.val}%</span>
                      </div>
                      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px' }}>
                        <div style={{ width: `${skill.val}%`, height: '100%', background: skill.c, borderRadius: '1.5px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ background: 'rgba(45,212,191,0.03)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <div style={{ color: '#2dd4bf', fontSize: '20px', fontWeight: 700 }}>92%</div>
                  <div style={{ color: '#888880', fontSize: '8px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Rating</div>
                </div>
                
                <button style={{ background: '#2dd4bf', border: 'none', borderRadius: '4px', color: '#000000', fontWeight: 600, fontSize: '9px', padding: '6px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Hire Candidate
                </button>
              </div>
            </div>
            
            {/* Panel footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '5px', marginTop: '5px', flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#888880', fontSize: '7.5px' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Evaluation Completed
              </span>
              <span style={{ color: '#2dd4bf', fontSize: '7.5px', fontWeight: 600 }}>View Full Scorecard ›</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Small line icons for the sourcing feature grid
  const renderFeatureIcon = (name) => {
    const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (name) {
      case 'search':
        return (<svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>);
      case 'globe':
        return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>);
      case 'people':
        return (<svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
      case 'star':
        return (<svg {...common}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
      case 'phone':
        return (<svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
      case 'chat':
        return (<svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
      case 'doc':
        return (<svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
      case 'chart':
        return (<svg {...common}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
      case 'link':
        return (<svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
      case 'brief':
        return (<svg {...common}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
      case 'target':
        return (<svg {...common}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
      default:
        return null;
    }
  };

  const [headingProgress, setHeadingProgress] = React.useState(0);
  const headingRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const start = window.innerHeight;
      const end = window.innerHeight * 0.2;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setHeadingProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <section data-scroll ref={sectionRef} style={{
      height: '600vh',
      background: '#000000',
      position: 'relative',
    }}>
      {/* Heading scrolls normally — NOT sticky */}
      <div ref={headingRef} data-scroll data-scroll-speed="-0.1" style={{
        textAlign: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)',
        boxSizing: 'border-box',
        opacity: headingProgress,
        transform: `translateY(${(1-headingProgress)*60}px)`,
        transition: 'transform 0.1s linear, opacity 0.1s linear',
      }}>

        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          fontWeight: 700,
          color: '#EEEEEE',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          margin: 0,
        }}>
          <span style={{ background:'linear-gradient(135deg,#2dd4bf,#64a0dc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>One platform.</span><br /> Every layer of hiring, handled.
        </h2>
      </div>

      {/* Sticky zone — only tabs + card */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 'clamp(12px, 4vw, 48px)',
        paddingRight: 'clamp(12px, 4vw, 48px)',
        paddingTop: '16px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        opacity: 1,
        transform: 'scale(1)',
      }}>
        {/* Tabs Menu (Center Aligned) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '65px',
marginBottom: '28px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleSlideChange(idx)}
              style={{
                background: activeIndex === idx ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: `1.5px solid ${activeIndex === idx ? card.accent : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '999px',
                padding: '6px 18px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(11px, 1.8vw, 13px)',
                fontWeight: 500,
                color: activeIndex === idx ? '#EEEEEE' : '#888880',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {card.label}
            </button>
          ))}
        </div>

        {/* Slide Carousel Card Layout */}
        <div style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: 0,
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {cards.map((card, i) => {
            const { x, percent, scale, opacity, zIndex } = getCardStyles(i, activeIndex);
            return (
              <div
                key={i}
                className="sol-card-grid"
                style={{
                  position: 'absolute',
                  inset: 0,
                  maxHeight: '460px',
                  overflow: 'hidden',
                  transform: `translateX(${x}${percent ? '%' : 'px'}) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                  pointerEvents: opacity < 0.1 ? 'none' : 'auto',
                  
                  /* Card style */
                  width: '100%',
                  maxWidth: '1200px',
                  background: '#0D0D0E',
                  border: `1.5px solid ${card.border}`,
                  borderRight: isMobile ? `1.5px solid ${card.border}` : 'none', /* Blend off-screen on desktop */
                  borderRadius: isMobile ? '24px' : '32px 0 0 32px',
                  padding: isMobile 
                    ? 'clamp(16px, 2.5vw, 28px) clamp(14px, 3vw, 28px)' 
                    : 'clamp(16px, 2.5vw, 28px) 0 clamp(16px, 2.5vw, 28px) clamp(14px, 3vw, 40px)',
                  boxSizing: 'border-box',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(320px, 42%) 1fr',
                  gap: '32px',
                  alignItems: 'center',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), -15px 0 35px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Accent glow on top left of the card */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '300px',
                  height: '300px',
                  background: card.bgGradient,
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />

                {/* Left Column Content */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflow: 'hidden',
                }}>
                  {(card.variant === 'sourcing' || card.variant === 'screening' || card.variant === 'functional') ? (
                  <>
                  {/* Icon + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${card.accent}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: card.accent,
                    }}>
                      {card.variant === 'sourcing' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ) : card.variant === 'screening' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '5px 14px', borderRadius: '999px',
                      border: `1.5px solid ${card.accent}`,
                      color: card.accent,
                      fontFamily: 'Outfit, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
                    }}>{card.badge}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
                    fontWeight: 700,
                    lineHeight: 1.08,
                    margin: 0,
                    color: '#EEEEEE',
                    letterSpacing: '-0.01em',
                  }}>
                    <span style={{ background: 'linear-gradient(135deg,#2dd4bf,#64a0dc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{card.titleAccent}</span><br />{card.titleRest}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    color: '#888880',
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {card.body}
                  </p>

                  {/* Feature grid */}
                  <div className="sol-feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {card.features.map((f, idx) => {
                      const hasDesc = card.variant === 'sourcing' || card.variant === 'functional';
                      return (
                      <div key={idx} style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        padding: hasDesc ? '10px' : '8px 10px',
                        gridColumn: (card.variant === 'screening' && idx === 4) ? 'span 2' : 'auto',
                        display: card.variant === 'screening' ? 'flex' : 'block',
                        alignItems: card.variant === 'screening' ? 'center' : 'stretch',
                        gap: card.variant === 'screening' ? '8px' : '0px',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: hasDesc ? '5px' : '0px',
                          color: card.accent,
                          flexShrink: 0
                        }}>
                          {renderFeatureIcon(f.icon)}
                          {hasDesc && (
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '11.5px', fontWeight: 600, color: '#EEEEEE' }}>{f.title}</span>
                          )}
                        </div>
                        {hasDesc ? (
                          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10.5px', color: '#888880', lineHeight: 1.4, margin: 0 }}>{f.desc}</p>
                        ) : (
                          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '11px', fontWeight: 600, color: '#EEEEEE' }}>{f.title}</span>
                        )}
                      </div>
                      );
                    })}
                  </div>
                  </>
                  ) : (
                  <>
                  {/* Slider Navigation Controls (Arrow, dots, arrow) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <button
                      onClick={handlePrev}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#EEEEEE',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      &lt;
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {cards.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSlideChange(idx)}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: activeIndex === idx ? card.accent : 'rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#EEEEEE',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 700,
                    color: card.accent,
                    lineHeight: 1.15,
                    margin: 0,
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '15px',
                    color: '#888880',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {card.body}
                  </p>

                  {/* Pills tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    {card.pills.map((pill, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '11px',
                          color: '#EEEEEE',
                        }}
                      >
                        {pill}
                      </div>
                    ))}
                  </div>
                  </>
                  )}
                </div>

                {/* Right Column MacBook Mockup */}
                <div style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                  <div className="sol-card-mockup" style={{
                    width: '120%', /* Extends off screen */
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#121212',
                    border: '10px solid #1E1E1E',
                    borderBottomWidth: '14px',
                    position: 'relative',
                  }}>
                    {/* Webcam notch */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '8px',
                      background: '#1E1E1E',
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      zIndex: 10,
                    }} />

                    {/* Browser top bar */}
                    <div style={{
                      height: '28px',
                      background: '#18181A',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      gap: '6px',
                      flexShrink: 0,
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF5F56' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFBD2E' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27C93F' }} />
                      
                      <div style={{
                        flex: 1,
                        maxWidth: '280px',
                        margin: '0 auto',
                        height: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        color: '#555550',
                      }}>
                        app.interviehire.com/dashboard
                      </div>
                    </div>

                    {/* Active Screen Content Area */}
                    <div style={{
                      background: '#0B0B0C',
                      height: (card.uiType === 'sourcing' || card.uiType === 'screening' || card.uiType === 'resume' || card.uiType === 'functional') ? 'clamp(260px, 32vw, 420px)' : 'clamp(200px, 25vw, 330px)',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {renderScreenContent(card.uiType)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes voiceWavePulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.45; }
        }
        @keyframes heightPulse {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.1); }
        }
        @media (max-width: 768px) {
          .sol-card-grid { grid-template-columns: 1fr !important; }
          .sol-card-mockup { display: none !important; }
        }
        @media (max-width: 480px) {
          .sol-feature-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </section>

    {/* CTA after 5th card — normal document flow, NOT inside the sticky section */}
    <div style={{ background: '#000000', position: 'relative', zIndex: 2, marginBottom: 'clamp(40px, 5vw, 80px)' }}>
      <SeeAllFeaturesCTA />
    </div>
    </>
  );
};
