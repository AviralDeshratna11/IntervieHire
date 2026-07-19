'use client';
import React from 'react';
import { FadeUpOnScroll } from '../../ui';

export const CalculatorSection = () => {
  const [hires, setHires] = React.useState(2); // Start at min
  const [salary, setSalary] = React.useState(20000); // Start at min
  const [displayMoney, setDisplayMoney] = React.useState(0);
  const [displayHours, setDisplayHours] = React.useState(0);
  const [vibe, setVibe] = React.useState(false);
  const [hasEntered, setHasEntered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(true);
  const sectionRef = React.useRef(null);

  const triggerVibe = () => {
    setVibe(true);
    setTimeout(() => setVibe(false), 60);
  };

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (!hasEntered || !isAnimating) return;

    const duration = 3000;
    const startTime = performance.now();
    let animFrame;

    const targetHires = 15;
    const targetSalary = 90000;
    const targetMoney = Math.round(targetHires * targetSalary * 0.08);
    const targetHours = targetHires * 35;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Ease out quartic

      const currentHires = Math.round(2 + ease * (targetHires - 2));
      const currentSalary = Math.round(20000 + ease * (targetSalary - 20000));
      const currentMoney = Math.round(ease * targetMoney);
      const currentHours = Math.round(ease * targetHours);

      setHires(currentHires);
      setSalary(currentSalary);
      setDisplayMoney(currentMoney);
      setDisplayHours(currentHours);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [hasEntered, isAnimating]);

  React.useEffect(() => {
    if (!isAnimating) {
      setDisplayMoney(Math.round(hires * salary * 0.08));
      setDisplayHours(hires * 35);
    }
  }, [hires, salary, isAnimating]);

  const handleHiresChange = (e) => {
    setIsAnimating(false);
    setHires(parseInt(e.target.value, 10));
    triggerVibe();
  };

  const handleSalaryChange = (e) => {
    setIsAnimating(false);
    setSalary(parseInt(e.target.value, 10));
    triggerVibe();
  };

  const formatCurrency = (num) => {
    return '$' + num.toLocaleString('en-US');
  };

  const hiresPercent = ((hires - 2) / (100 - 2)) * 100;
  const salaryPercent = ((salary - 20000) / (250000 - 20000)) * 100;

  return (
    <section data-scroll
      ref={sectionRef} 
      id="calculator" 
      style={{ 
        background: '#000000', 
        padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 48px) clamp(80px, 10vw, 140px)', 
        position: 'relative', 
        overflow: 'hidden',
        borderTop: '1px solid rgba(45,212,191, 0.08)',
        borderBottom: 'none',
        zIndex: 2,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Glowing cut-line — visible as this section slides over the explainer video */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191, 0.55), 0 4px 80px rgba(45,212,191, 0.18)',
        zIndex: 20,
        pointerEvents: 'none',
      }} />

      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        height: 600,
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: hasEntered ? 1 : 0,
        transition: 'opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <FadeUpOnScroll delay={0.0} y={30}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
          </div>
        </FadeUpOnScroll>

        {/* ── Static heading ── */}
        <h2 style={{
          fontFamily:'Outfit, sans-serif',
          fontSize:'clamp(2.4rem, 5.5vw, 4rem)',
          fontWeight:700, color:'#EEEEEE',
          letterSpacing:'-0.02em', lineHeight:1.15,
          margin:'0 0 32px', textAlign:'center',
        }}>
          Measure Your{' '}
          <span style={{
            background:'linear-gradient(135deg,#2dd4bf,#64a0dc)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text',
          }}>Savings.</span>
        </h2>

        <FadeUpOnScroll delay={0.15} y={20}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(13px, 2vw, 15px)',
              color: '#888880',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Use our interactive estimator to see how much recruiting costs and team hours you save with intervieHire.
            </p>
          </div>
        </FadeUpOnScroll>

        {/* Calculator Layout */}
        <div className="calc-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 'clamp(16px, 3vw, 28px)',
          alignItems: 'center'
        }}>
          {/* Sliders Container (Glass Card) */}
          <FadeUpOnScroll delay={0.1} y={30}>
            <div style={{
              background: 'rgba(15, 15, 18, 0.6)',
              border: '1px solid rgba(45,212,191, 0.1)',
              borderRadius: 20,
              padding: 'clamp(20px, 3vw, 28px) clamp(16px, 3vw, 24px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Slider 1 */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#EEEEEE', fontSize: 'clamp(12px, 2vw, 14px)' }}>Hires Planned Per Year</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#2dd4bf', fontSize: 16 }}>{hires}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={hires}
                  onChange={handleHiresChange}
                  className="ih-calculator-slider"
                  style={{
                    background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${hiresPercent}%, rgba(255,255,255,0.1) ${hiresPercent}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#EEEEEE', fontSize: 'clamp(12px, 2vw, 14px)' }}>Average Annual Role Salary</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#2dd4bf', fontSize: 16 }}>{formatCurrency(salary)}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={salary}
                  onChange={handleSalaryChange}
                  className="ih-calculator-slider"
                  style={{
                    background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${salaryPercent}%, rgba(255,255,255,0.1) ${salaryPercent}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
            </div>
          </FadeUpOnScroll>

          {/* Results Container */}
          <FadeUpOnScroll delay={0.25} y={30}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 3vw, 24px)',
              transform: vibe ? 'translate(1px, 1px) rotate(0.4deg)' : 'none',
              transition: 'transform 0.05s ease-out'
            }}>
              {/* Money Saved */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(45,212,191, 0.08) 100%)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              borderRadius: 20,
              padding: 'clamp(16px, 3vw, 24px)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', color: '#888880', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Annual Recruiting Cost Saved
                </p>
                <div style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  color: '#DDDDDD',
                  lineHeight: 1.1
                }}>
                  {formatCurrency(displayMoney)}
                </div>
              </div>

              {/* Hours Saved */}
              <div style={{
                background: 'rgba(15, 15, 18, 0.6)',
              border: '1px solid rgba(45,212,191, 0.1)',
              borderRadius: 20,
              padding: 'clamp(16px, 3vw, 24px)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', color: '#888880', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Manager Interview Hours Saved
                </p>
                <div style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  color: '#EEEEEE',
                  lineHeight: 1.1
                }}>
                  {displayHours} hrs
                </div>
              </div>
            </div>
          </FadeUpOnScroll>
        </div>
      </div>
      {/* Golden line bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(45,212,191,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(45,212,191, 0.55), 0 4px 80px rgba(45,212,191, 0.18)',
        pointerEvents: 'none',
      }} />
    </section>
  );
};
