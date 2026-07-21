'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui';
import { useMediaQuery } from '../hooks';
import { NAV_LINKS, DROPDOWN_LINKS } from '../constants';

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const Navbar = ({ simple }) => {
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [contentReady, setContentReady] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Legal/help documents surfaced from the navbar (served by /help/[doc]).
  const HELP_LINKS = [
    { label: 'Terms of Service', href: '/help/terms' },
    { label: 'Privacy Policy', href: '/help/privacy' },
    { label: 'DPA', href: '/help/dpa' },
  ];

  React.useEffect(() => {
    const onScroll = () => setScrolled((window.__lenis?.scroll ?? 0) > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (simple) {
      setLoaded(true);
      setContentReady(true);
      return;
    }
    if (sessionStorage.getItem('nb_loaded')) {
      setLoaded(true);
      setContentReady(true);
      return;
    }
    const t1 = setTimeout(() => setLoaded(true), 200);
    const t2 = setTimeout(() => { setContentReady(true); sessionStorage.setItem('nb_loaded', '1'); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [simple]);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNav = (path, target) => {
    if (path) {
      router.push(path);
    } else {
      handleScroll(target);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: scrolled ? '0px' : '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: loaded ? (scrolled ? '100%' : 'calc(100% - clamp(16px, 6vw, 96px))') : '52px',
      maxWidth: loaded ? (scrolled ? '100%' : '1200px') : '52px',
      height: '56px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: loaded ? 'space-between' : 'center',
      padding: loaded ? '0 10px 0 clamp(12px, 4vw, 32px)' : '0',
      borderRadius: loaded ? (scrolled ? '0' : '999px') : '50%',
      background: loaded ? (scrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.35)') : '#2dd4bf',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: loaded ? (scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(255, 255, 255, 0.12)') : '1px solid rgba(45,212,191, 0.5)',
      boxShadow: loaded ? (scrolled ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 12px 32px rgba(0, 0, 0, 0.4)') : '0 0 50px rgba(45,212,191, 0.4)',
      transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>

      {/* Content wrapper — fades in after ball expands */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', height: '100%',
        opacity: contentReady ? 1 : 0,
        transition: 'opacity 0.4s ease 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={28} />
        </div>

        {!isMobile && (<>
          {/* Desktop Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 32px)', height: '100%' }}>
            {NAV_LINKS.map((link, idx) => (
              <a
                key={idx}
                href={link.path || link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.path, link.target); }}
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
              >
                {link.label}
              </a>
            ))}

            {/* About Link */}
            <a
              href="/resources/about-founder"
              onClick={(e) => { e.preventDefault(); handleNav('/resources/about-founder'); }}
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
              onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
            >
              About
            </a>

            {/* Help dropdown — legal docs (Terms / Privacy / DPA), hover-revealed. */}
            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', paddingBottom: '16px', marginBottom: '-16px' }}
              onMouseEnter={() => setHelpOpen(true)}
              onMouseLeave={() => setHelpOpen(false)}
            >
              <span
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, color: '#A0A0A0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
                onClick={() => setHelpOpen(!helpOpen)}
              >
                Help
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transition: 'transform 0.2s', transform: helpOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {helpOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 8, padding: '8px 0', minWidth: 190, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 101 }}>
                  {HELP_LINKS.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      style={{ display: 'block', fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#888880', padding: '8px 16px', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#2dd4bf'; e.currentTarget.style.background = 'rgba(45,212,191,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#888880'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>)}

        {/* Right side: CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 24px)', height: '100%' }}>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#A0A0A0' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
          <a
            href="/login"
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
            onMouseLeave={e => e.currentTarget.style.color = '#A0A0A0'}
          >
            Sign In
          </a>
          <button
            className="navbar-cta-btn"
            onClick={() => window.location.href = '/book-demo'}
            style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '15px', fontWeight: 600,
              background: '#2dd4bf', color: '#0A0A0A',
              border: 'none', borderRadius: '99px',
              padding: '12px 24px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Book a Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(45,212,191,0.15)',
          padding: '16px clamp(12px, 4vw, 32px)',
          display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 99,
        }}>
          {NAV_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.path || link.href}
              onClick={(e) => { e.preventDefault(); handleNav(link.path, link.target); }}
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, color: '#A0A0A0', textDecoration: 'none', padding: '10px 0', transition: 'color 0.2s' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/resources/about-founder"
            onClick={(e) => { e.preventDefault(); handleNav('/resources/about-founder'); }}
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, color: '#888880', textDecoration: 'none', padding: '10px 0', cursor: 'pointer' }}
          >
            About
          </a>
          {HELP_LINKS.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, color: '#888880', textDecoration: 'none', padding: '10px 0' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
      <style>{`
        .navbar-cta-btn {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .navbar-cta-btn::after {
          content: ''; position: absolute; inset: 0; border-radius: 99px;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .navbar-cta-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(45,212,191,0.3);
        }
        .navbar-cta-btn:hover::after {
          opacity: 1;
          animation: navbarBtnShine 0.8s ease;
        }
        @keyframes navbarBtnShine {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </nav>
  );
};
