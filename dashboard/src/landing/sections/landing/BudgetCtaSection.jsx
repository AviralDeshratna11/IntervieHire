'use client';
import React from 'react';

export const BudgetCtaSection = () => {
  const videoRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      if (!videoRef.current) return;
      const rect = videoRef.current.getBoundingClientRect();
      const total = videoRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const t = Math.min(progress * 2, 1);
  const scale = 0.7 + t * 0.3;
  const radius = 20 * (1 - t);

  return (
    <section data-scroll ref={videoRef} style={{ height: '300vh', position: 'relative', background: '#000', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        background: '#000', overflow: 'hidden',
      }}>

        {/* Video */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 0 }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: radius,
            overflow: 'hidden',
            background: '#0A0A0A',
            border: t < 0.3 ? '1px solid rgba(45,212,191,0.1)' : 'none',
            boxShadow: t < 0.8
              ? '0 0 80px rgba(45,212,191,0.06)'
              : 'none',
            transform: `scale(${scale})`,
            willChange: 'transform',
            opacity: entered ? 1 : 0,
            filter: entered ? 'blur(0px)' : 'blur(8px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <video
              src="/mp_.mp4"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetCtaSection;
