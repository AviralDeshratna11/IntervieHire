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

  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ctaRef}
      style={{
        textAlign: 'center',
        padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 48px)',
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
        background: 'radial-gradient(ellipse, rgba(217,100,36,0.08) 0%, transparent 70%)',
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
        <div style={{ width: 28, height: 1, background: 'rgba(217,100,36,0.4)' }} />
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#d96424',
          fontWeight: 600,
        }}>5 capabilities. One platform.</span>
        <div style={{ width: 28, height: 1, background: 'rgba(217,100,36,0.4)' }} />
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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 32px',
            borderRadius: 999,
            background: hovered
              ? 'linear-gradient(135deg, #ba5520, #d96424)'
              : '#d96424',
            color: '#000000',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
            boxShadow: hovered
              ? '0 0 45px rgba(217,100,36,0.6), 0 8px 24px rgba(0,0,0,0.4)'
              : '0 0 20px rgba(217,100,36,0.25), 0 4px 16px rgba(0,0,0,0.3)',
            transform: hovered ? 'scale(1.05) translateY(-1px)' : 'scale(1)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            cursor: 'pointer',
          }}
        >
          <span>Explore All Features</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Ghost secondary link */}
      <div style={{
        marginTop: 18,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s 0.55s',
      }}>
        <a
          href="/resources/blogs"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13,
            color: '#555550',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            borderBottom: '1px solid rgba(85,85,80,0.3)',
            paddingBottom: 2,
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color='#d96424'; e.currentTarget.style.borderColor='rgba(217,100,36,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='#546a7b'; e.currentTarget.style.borderColor='rgba(84,106,123,0.3)'; }}
        >
          Read more about IntervieHire in our blogs →
        </a>
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
      case 'parsing':
        return (
          <div style={{ padding: '16px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600 }}>Active Jobs &gt; Frontend Engineer</div>
              <div style={{ color: '#DDDDDD' }}>Match Rating Enabled</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'hidden' }}>
              {[
                { name: "Sarah Chen", score: "98% Match", details: "5 yrs exp • React, Next.js, TypeScript", active: true },
                { name: "Alex Rivera", score: "92% Match", details: "4 yrs exp • React, Redux, Node.js", active: false },
                { name: "James Wilson", score: "84% Match", details: "3 yrs exp • Vue, JavaScript, CSS3", active: false },
                { name: "Emily Rogers", score: "79% Match", details: "2 yrs exp • React, TailwindCSS, Git", active: false }
              ].map((cand, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${cand.active ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ color: '#EEEEEE', fontWeight: 500, fontSize: '13px' }}>{cand.name}</div>
                    <div style={{ fontSize: '11px', color: '#555550', marginTop: '2px' }}>{cand.details}</div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: cand.active ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)',
                    color: cand.active ? '#DDDDDD' : '#888880',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>{cand.score}</div>
                </div>
              ))}
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
                <div><span style={{ color: '#d96424' }}>import</span> React <span style={{ color: '#d96424' }}>from</span> <span style={{ color: '#A5D6A7' }}>'react'</span>;</div>
                <br/>
                <div><span style={{ color: '#d96424' }}>const</span> <span style={{ color: '#EEEEEE' }}>InterviewSolution</span> = () =&gt; &#123;</div>
                <div style={{ paddingLeft: '12px' }}><span style={{ color: '#d96424' }}>const</span> [score, setScore] = React.useState(<span style={{ color: '#FFB300' }}>100</span>);</div>
                <div style={{ paddingLeft: '12px' }}><span style={{ color: '#d96424' }}>return</span> (</div>
                <div style={{ paddingLeft: '24px' }}>&lt;<span style={{ color: '#d96424' }}>div</span> className=<span style={{ color: '#A5D6A7' }}>"candidate-ide"</span>&gt;</div>
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
          <div style={{ padding: '16px', color: '#888880', fontSize: '12px', fontFamily: 'Outfit, sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ color: '#EEEEEE', fontWeight: 600 }}>Candidate Evaluation Profile</div>
              <div style={{ color: '#d96424', fontWeight: 600 }}>Approved to Hire</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ color: '#EEEEEE', fontWeight: 600 }}>Score Distribution</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {[
                      { name: "Technical Depth", val: 94, c: "#d96424" },
                      { name: "System Design", val: 88, c: "#d96424" },
                      { name: "Communication", val: 90, c: "#DDDDDD" }
                    ].map((skill, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                          <span>{skill.name}</span>
                          <span style={{ fontWeight: 'bold' }}>{skill.val}%</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                          <div style={{ width: `${skill.val}%`, height: '100%', background: skill.c, borderRadius: '2px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: 'rgba(217,100,36,0.04)', border: '1px solid rgba(217,100,36,0.2)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <div style={{ color: '#d96424', fontSize: '24px', fontWeight: 700 }}>92%</div>
                  <div style={{ color: '#888880', fontSize: '10px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Rating</div>
                </div>
                
                <button style={{ background: '#d96424', border: 'none', borderRadius: '6px', color: '#000000', fontWeight: 600, fontSize: '11px', padding: '8px 0', cursor: 'pointer' }}>
                  Hire Candidate
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const dissolve = 0;

  return (
    <>
    <section data-scroll ref={sectionRef} style={{
      height: '600vh',
      background: '#000000',
      position: 'relative',
    }}>
      {/* Heading scrolls normally — NOT sticky */}
      <div data-scroll data-scroll-speed="-0.1" style={{
        textAlign: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)',
        boxSizing: 'border-box',
        opacity: 1 - dissolve,
        transform: `translateY(${dissolve * 20}px)`,
      }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#d96424',
          marginBottom: '12px',
        }}>
          The Solution
        </div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          color: '#EEEEEE',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          One platform. Every layer of hiring, handled.
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
        opacity: 1 - dissolve,
        transform: `scale(${1 - dissolve * 0.05})`,
      }}>
        {/* Tabs Menu (Center Aligned) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
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
                    ? 'clamp(20px, 3vw, 40px) clamp(16px, 4vw, 32px)' 
                    : 'clamp(20px, 3vw, 40px) 0 clamp(20px, 3vw, 40px) clamp(16px, 4vw, 48px)',
                  boxSizing: 'border-box',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(350px, 42%) 1fr',
                  gap: '40px',
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
                  gap: '20px',
                }}>
                  
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
                      height: 'clamp(200px, 25vw, 330px)',
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
        @media (max-width: 768px) {
          .sol-card-grid { grid-template-columns: 1fr !important; }
          .sol-card-mockup { display: none !important; }
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
