'use client';
import React, { useEffect, useRef, useState } from 'react';
import { THEME, BLOGS } from '../../constants';

const T = THEME;

const BlogCard = ({ post, idx }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: T.card, borderRadius: 16, border: '1px solid rgba(217,100,36,0.06)',
      padding: 'clamp(20px,3vw,28px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.06}s`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          padding: '4px 10px', borderRadius: 100,
          background: 'rgba(217,100,36,0.1)', color: T.gold, border: '1px solid rgba(217,100,36,0.15)'
        }}>{post.tag}</span>
        <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: T.muted }}>{post.readTime}</span>
      </div>
      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: T.muted, marginBottom: 10, fontWeight: 500 }}>{post.date}</div>
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(15px,2.2vw,17px)', fontWeight: 700, color: T.white, lineHeight: 1.3, margin: '0 0 10px' }}>{post.title}</h3>
      <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(12px,1.8vw,13px)', color: T.muted, lineHeight: 1.65, margin: '0 0 16px' }}>{post.excerpt}</p>
      <a href="#" style={{
        fontFamily: 'Outfit,sans-serif', fontSize: 13, color: T.white, textDecoration: 'none',
        fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'color 0.2s'
      }}
        onMouseEnter={e => e.target.style.color = T.gold}
        onMouseLeave={e => e.target.style.color = T.white}
      >
        Read Article
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
};

export const BlogsSection = () => {
  const [activeTag, setActiveTag] = useState('All');
  const tags = ['All', ...new Set(BLOGS.map(b => b.tag))];
  const filtered = activeTag === 'All' ? BLOGS : BLOGS.filter(b => b.tag === activeTag);

  return (
    <div style={{ position: 'relative' }}>
      {/* Golden cut-line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 20,
        background: 'linear-gradient(90deg, transparent 0%, rgba(217,100,36,0.5) 20%, rgba(255,255,255,0.95) 50%, rgba(217,100,36,0.5) 80%, transparent 100%)',
        boxShadow: '0 0 40px 2px rgba(217,100,36,0.55), 0 4px 80px rgba(217,100,36,0.18)',
      }} />

      <section data-scroll id="blogs" style={{ background: T.bg, padding: 'clamp(100px,14vh,160px) clamp(16px,4vw,48px) clamp(60px,8vw,100px)', borderTop: '1px solid rgba(217,100,36,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '6px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              background: 'rgba(217,100,36,0.1)', border: '1px solid rgba(217,100,36,0.2)', color: T.gold
            }}>
              Resources
            </div>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 700,
              color: T.white, letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0
            }}>
              Our Latest <span style={{
                background: 'linear-gradient(90deg, #d96424, #8a3a10)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>Articles.</span>
            </h2>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 'clamp(32px,5vw,48px)' }}>
            {tags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '8px 18px', borderRadius: 100,
                cursor: 'pointer', transition: 'all 0.3s ease',
                background: activeTag === tag ? T.gold : 'rgba(217,100,36,0.06)',
                color: activeTag === tag ? '#000' : T.muted,
                border: activeTag === tag ? 'none' : '1px solid rgba(217,100,36,0.15)'
              }}>
                {tag}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'clamp(16px,2.5vw,24px)' }}>
            {filtered.map((post, idx) => (
              <BlogCard key={`${post.title}-${idx}`} post={post} idx={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
