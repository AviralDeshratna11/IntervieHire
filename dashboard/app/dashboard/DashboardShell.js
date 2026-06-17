'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initDashboardPage } from '../../src/dashboard/index.js';
import { html } from '../../src/html/dashboard-crystal';
import { apiMe, apiLogout, isAuthed, clearAuthed } from '../../src/auth-client.js';

const ROLE_LABEL = { super_admin: 'Admin', org_admin: 'Org. Admin', member: 'Member' };

// 401-style messages from the api client; anything else (network/backend down)
// is treated as "unverified" rather than "rejected".
const UNAUTHED_RE = /401|not authenticated|unauthor|credential|user not found/i;

function VerifyingScreen() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#0a0a0a', color: '#9a9a9a', fontFamily: "'Outfit', system-ui, sans-serif", zIndex: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 34, height: 34, margin: '0 auto 14px', borderRadius: '50%', border: '2px solid rgba(45,212,191,0.2)', borderTopColor: '#2dd4bf', animation: 'ih-auth-spin 0.8s linear infinite' }} />
        <div style={{ fontSize: '0.85rem', letterSpacing: '0.02em' }}>Verifying your session…</div>
      </div>
      <style>{'@keyframes ih-auth-spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

// The vanilla dashboard surface. memo() + no props => renders exactly once,
// React never re-runs it — parent re-renders can't reset dangerouslySetInnerHTML
// and wipe the vanilla-JS-injected content (job cards, kanban, etc.).
const DashboardSurface = memo(function DashboardSurface({ onMounted }) {
  useEffect(() => {
    const cleanup = initDashboardPage();
    // Signal to parent that the vanilla engine is running
    if (onMounted) onMounted();
    return () => { if (cleanup) cleanup(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
});

/**
 * DashboardShell
 *
 * Shared auth-guarded wrapper for every dashboard route page.
 *
 * @param {Object}   props
 * @param {Function} props.navigateTo  Called once after the vanilla engine mounts.
 *                                     Should call e.g. window.navigateToTab?.('jobs').
 *                                     Receives no arguments. May be async-deferred internally.
 */
export default function DashboardShell({ navigateTo }) {
  const router = useRouter();
  // Start 'checking' on both server and first client render to avoid hydration mismatch.
  const [phase, setPhase] = useState('checking');
  const [user, setUser] = useState(null);
  const navigateCalled = useRef(false);

  // Optimistic upgrade — client-only, after hydration.
  useEffect(() => {
    if (isAuthed()) setPhase('authed');
  }, []);

  // Authoritative session check against the backend.
  useEffect(() => {
    let cancelled = false;
    const optimistic = isAuthed();

    apiMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setPhase('authed');
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = (err && err.message) || '';
        if (UNAUTHED_RE.test(msg)) {
          clearAuthed();
          router.replace('/login');
        } else if (!optimistic) {
          router.replace('/login');
        }
        // else: optimistic session + backend hiccup → stay on the dashboard.
      });

    return () => { cancelled = true; };
  }, [router]);

  // Reflect the signed-in user into the sidebar profile (runs after the surface
  // has mounted and /me has returned).
  useEffect(() => {
    if (phase !== 'authed' || !user) return;
    const label = (user.name || user.username || 'Account').trim();
    const nameEl = document.querySelector('.user-profile .user-name');
    const roleEl = document.querySelector('.user-profile .user-role');
    const avatarEl = document.querySelector('.user-profile .user-avatar');
    if (nameEl) nameEl.textContent = label;
    if (roleEl) roleEl.textContent = ROLE_LABEL[user.user_type] || 'Member';
    if (avatarEl) avatarEl.textContent = (label[0] || 'A').toUpperCase();

    const firstName = label.split(/\s+/)[0] || label;
    window.IH_USER_NAME = firstName;
    const titleEl = document.getElementById('header-main-title');
    if (titleEl && /^good (morning|afternoon|evening)/i.test((titleEl.textContent || '').trim())) {
      titleEl.textContent = typeof window.__ihBuildGreeting === 'function'
        ? window.__ihBuildGreeting()
        : `Good day, ${firstName}`;
    }
  }, [phase, user]);

  // Bind logout button.
  useEffect(() => {
    if (phase !== 'authed') return;
    let timer;
    const bind = () => {
      const btn = document.querySelector('.user-profile .btn-logout');
      if (!btn) { timer = setTimeout(bind, 80); return; }
      if (btn.dataset.ihLogout) return;
      const fresh = btn.cloneNode(true);
      btn.replaceWith(fresh);
      fresh.dataset.ihLogout = '1';
      fresh.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        fresh.setAttribute('disabled', '');
        try { await apiLogout(); } catch {}
        router.replace('/login');
      });
    };
    timer = setTimeout(bind, 80);
    return () => clearTimeout(timer);
  }, [phase, router]);

  if (phase !== 'authed') return <VerifyingScreen />;

  // onMounted fires once when the vanilla engine initialises. We call navigateTo
  // there so that navigateToTab / openJobFlowView etc. have the DOM ready.
  const handleMounted = () => {
    if (navigateCalled.current) return;
    navigateCalled.current = true;
    // Small tick to let the vanilla mount bindings settle (mirrors original setTimeout(initMountBindings, 0))
    setTimeout(() => {
      if (typeof navigateTo === 'function') navigateTo();
    }, 20);
  };

  return <DashboardSurface onMounted={handleMounted} />;
}
