'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSyncExternalStore } from 'react';

const ScrollContext = createContext(null);

let globalScrollY = 0;
let globalLenis = null;
const listeners = new Set();

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() { return globalScrollY; }

export const useScrollY = () => useSyncExternalStore(subscribe, getSnapshot);
export const useLenis = () => globalLenis;

export const SmoothScrollProvider = ({ children }) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // Detect touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (isTouch) {
      // On mobile/touch: Use native scrolling. Sync window.__scrollWrapper so GSAP works.
      window.__scrollWrapper = window;

      const onNativeScroll = () => {
        globalScrollY = window.scrollY;
        listeners.forEach((fn) => fn());
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onNativeScroll);
      };
    }

    // Set wrapper reference synchronously so GSAP/ScrollTrigger can find it
    window.__scrollWrapper = wrapper;

    let mounted = true;

    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;

      const locomotive = new LocomotiveScroll({
        lenisOptions: {
          wrapper,
          content,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          lerp: 0.08,
        },
        autoStart: true,
        scrollCallback: ({ scroll }) => {
          if (!mounted) return;
          globalScrollY = scroll;
          listeners.forEach((fn) => fn());
          window.dispatchEvent(new Event('scroll'));
        },
      });

      if (!mounted) { locomotive.destroy(); return; }

      globalLenis = locomotive.lenisInstance;
      window.__locomotive = locomotive;
      window.__lenis = globalLenis;

      // Setup GSAP ScrollTrigger proxy for Lenis
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.scrollerProxy(wrapper, {
          scrollTop(value) {
            if (arguments.length && globalLenis) {
              globalLenis.scrollTo(value, { immediate: true });
            }
            return globalLenis ? globalLenis.scroll : 0;
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth };
          },
          pinType: wrapper.style.transform ? 'transform' : 'fixed',
        });
        globalLenis.on('scroll', ScrollTrigger.update);
        ScrollTrigger.refresh();
      } catch (e) {
        // GSAP not available
      }
    })();

    return () => {
      mounted = false;
      if (window.__locomotive) { window.__locomotive.destroy(); window.__locomotive = null; }
      globalLenis = null;
      window.__lenis = null;
    };
  }, []);

  const wrapperStyle = isTouchDevice
    ? { width: '100%', position: 'relative' }
    : { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' };

  return (
    <ScrollContext.Provider value={{}}>
      <div ref={wrapperRef} data-scroll-wrapper style={wrapperStyle}>
        <div ref={contentRef} data-scroll-content>
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  );
};
