'use client';
import React from 'react';

// ─── GlassCard ────────────────────────────────────────────────────────────────
export const GlassCard = ({ children, style = {} }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(45,212,191,0.35)' : 'rgba(45,212,191,0.15)'}`,
        borderRadius: 12,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: 'clamp(20px, 3vw, 28px)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 8px 32px rgba(45,212,191,0.07)' : 'none',
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}
    >{children}</div>
  );
};

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
export const Eyebrow = ({ children, style = {} }) => {
  const finalColor = style.color || '#2dd4bf';
  return (
    <div style={{
      fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.18em', textTransform: 'uppercase', color: finalColor,
      marginBottom: 20,
      display: 'inline-flex', alignItems: 'center', gap: 10,
      ...style,
    }}>
      <span style={{ display: 'inline-block', width: 24, height: 1, background: finalColor, opacity: 0.6 }}/>
      {children}
    </div>
  );
};

// ─── FadeUpOnScroll ───────────────────────────────────────────────────────────
export const FadeUpOnScroll = ({ children, delay = 0, y = 50, threshold = 0.4 }) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 2.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>{children}</div>
  );
};

// ─── RevealCard ───────────────────────────────────────────────────────────────
export const RevealCard = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
};

// ─── Higher-Order Scroll Fade-In Utilities ──────────────────────────────────────

/**
 * Higher-order function to apply a smooth fade-in scroll animation to any DOM element.
 * Useful for vanilla JS elements or direct ref manipulation.
 *
 * @param {HTMLElement} element - The DOM element to animate
 * @param {Object} options - Animation configuration options
 * @param {number} [options.delay=0] - Delay in seconds before animation starts
 * @param {number} [options.y=30] - Initial vertical offset in pixels
 * @param {number} [options.threshold=0.15] - Intersection observer threshold (0 to 1)
 * @param {string} [options.duration='1.8s'] - CSS transition duration
 * @returns {Function} Clean up function to unobserve the element
 */
export const applyScrollFadeIn = (element, options = {}) => {
  if (!element) return () => {};
  
  const {
    delay = 0,
    y = 30,
    threshold = 0.15,
    duration = '1.8s',
  } = options;

  // Initialize styles on the element
  element.style.opacity = '0';
  element.style.transform = `translateY(${y}px)`;
  element.style.transition = `opacity ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      observer.disconnect();
    }
  }, { threshold });

  observer.observe(element);
  return () => observer.disconnect();
};

/**
 * React Hook to apply a smooth fade-in scroll animation to any React ref.
 *
 * @param {Object} options - Animation configuration options
 * @returns {React.RefObject} The ref to attach to the target element
 */
export const useScrollFadeIn = (options = {}) => {
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    if (ref.current) {
      const cleanup = applyScrollFadeIn(ref.current, options);
      return cleanup;
    }
  }, [options]);

  return ref;
};

/**
 * React Higher-Order Component (HOC) to wrap any component with scroll fade-in animation.
 *
 * @param {React.Component} WrappedComponent - Component to enhance
 * @param {Object} defaultOptions - Default configuration options
 */
export const withScrollFadeIn = (WrappedComponent, defaultOptions = {}) => {
  return function WithScrollFadeIn(props) {
    const { animationOptions = {}, ...restProps } = props;
    const ref = React.useRef(null);

    React.useEffect(() => {
      if (ref.current) {
        const cleanup = applyScrollFadeIn(ref.current, {
          ...defaultOptions,
          ...animationOptions
        });
        return cleanup;
      }
    }, [animationOptions]);

    return (
      <div ref={ref} style={{ display: 'block', width: '100%' }}>
        <WrappedComponent {...restProps} />
      </div>
    );
  };
};
