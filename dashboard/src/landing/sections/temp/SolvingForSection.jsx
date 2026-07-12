'use client';
import React, { useEffect, useRef, useState } from 'react';
import { SOLVES, TARGET_AUDIENCES } from '../constants';

export const SolvingForSection = () => {
  const sectionRef = useRef(null);
  const [ready, setReady] = useState(false);

  const solves = SOLVES;
  const targetAudiences = TARGET_AUDIENCES;

  // Wait for Lenis + scrollWrapper to be ready, then setup GSAP
  useEffect(() => {
    const check = setInterval(() => {
      if (window.__lenis && window.__scrollWrapper) {
        clearInterval(check);
        setReady(true);
      }
    }, 50);
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const wrapper = window.__scrollWrapper;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.solve-pair', {
        height: '100px',
        stagger: { amount: 0.5 },
        scrollTrigger: {
          trigger: '.pairs-container',
          scroller: wrapper,
          start: 'top 100%',
          end: 'top -150%',
          scrub: true,
        },
      });
      ScrollTrigger.refresh();
    })();
  }, [ready]);

  return (
    <section data-scroll data-scroll-class="reveal-text"
      id="solving-for"
      ref={sectionRef}
      style={{
        background: '#000000',
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 48px)',
        borderTop: '1px solid rgba(217,100,36,0.12)'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* ── Heading Row ── */}
        <div className="sf-grid-head" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          marginBottom: 48
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '6px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(217,100,36,0.1)', border: '1px solid rgba(217,100,36,0.2)', color: '#d96424'
            }}>
              Solutions
            </div>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#EEEEEE',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: 0
            }}>
              Hiring shouldn&apos;t be a full-time job.
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              lineHeight: 1.65,
              color: '#888880',
              margin: 0
            }}>
              We help software companies automate candidate screening so engineers can stay focused on building the core product. No scheduling tennis, no resume scanning fatigue, no guesswork.
            </p>
          </div>
        </div>

        {/* ── Vertical list of what we solve ── */}
        <div className="pairs-container" style={{
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid rgba(217,100,36,0.15)',
          marginBottom: 80
        }}>
          {solves.map((solve, idx) => (
            <div key={idx} className="solve-pair" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: 40,
              borderBottom: '1px solid rgba(217,100,36,0.15)',
              padding: '40px 0',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#EEEEEE',
                  margin: '0 0 16px'
                }}>
                  {solve.title}
                </h3>
                <p style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(13px, 1.6vw, 15px)',
                  lineHeight: 1.6,
                  color: '#888880',
                  margin: 0
                }}>
                  {solve.desc}
                </p>
              </div>
              <div style={{
                borderRadius: 16,
                overflow: 'hidden',
                maxHeight: 280,
                border: '1px solid rgba(217,100,36,0.12)'
              }}>
                <img src={solve.image} alt={solve.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Horizontal list of target audiences ── */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 700,
              color: '#EEEEEE',
              margin: 0
            }}>
              Built for every growth stage.
            </h3>
          </div>
          <div className="audiences-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(217,100,36,0.08)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img
                    src={targetAudiences[idx].image}
                    alt={targetAudiences[idx].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h4 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: 700,
                    color: '#EEEEEE',
                    margin: '0 0 12px'
                  }}>
                    {targetAudiences[idx].title}
                  </h4>
                  <p style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(13px, 1.6vw, 14.5px)',
                    lineHeight: 1.6,
                    color: '#888880',
                    margin: 0
                  }}>
                    {targetAudiences[idx].desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @media (max-width: 768px) {
          .sf-grid-head { grid-template-columns: 1fr !important; gap: 20px !important; }
          .solve-pair { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}}/>
    </section>
  );
};
