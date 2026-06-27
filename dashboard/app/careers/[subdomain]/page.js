import { Suspense } from 'react';
import JobGrid from './JobGrid';

// Resolve the FastAPI base. NEXT_PUBLIC_API_URL already INCLUDES the `/api` suffix
// in every environment (see .env.example / .env.production), so the public route is
// `${base}/public/careers/...` — NOT `${base}/api/public/...` (that double-prefixes).
function apiBase() {
  let base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
  if (!base.endsWith('/api')) base += '/api';
  return base;
}

async function fetchCareers(subdomain) {
  try {
    const res = await fetch(`${apiBase()}/public/careers/${encodeURIComponent(subdomain)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CareersPage({ params }) {
  const { subdomain } = await params;
  const data = await fetchCareers(subdomain);

  if (!data) {
    return (
      <main className="careers-page">
        <div className="careers-notfound">
          <div className="careers-notfound-badge">404</div>
          <h1>Career page not found</h1>
          <p>We couldn&apos;t find a careers page at this address. Double-check the link, or contact the company directly.</p>
        </div>
      </main>
    );
  }

  const org = data.organisation || {};
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];

  return (
    <main className="careers-page">
      <header className="careers-hero">
        <div className="careers-hero-glow" aria-hidden="true" />
        <div className="careers-hero-inner">
          {org.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="careers-logo" src={org.logo_url} alt={org.org_name || 'Company logo'} />
          ) : org.org_name ? (
            <div className="careers-logo careers-logo-fallback">{org.org_name.charAt(0).toUpperCase()}</div>
          ) : null}
          {org.org_name ? <div className="careers-org-name">{org.org_name}</div> : null}
          <h1 className="careers-headline">{org.career_intro || 'Join our team'}</h1>
          <p className="careers-subhead">
            {jobs.length > 0
              ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}`
              : 'Open roles'}
          </p>
        </div>
      </header>

      <section className="careers-body">
        {jobs.length === 0 ? (
          <div className="careers-empty">
            <h2>No open roles right now</h2>
            <p>There are no positions listed at the moment. Please check back soon.</p>
          </div>
        ) : (
          <Suspense fallback={<div className="careers-empty"><p>Loading roles…</p></div>}>
            <JobGrid jobs={jobs} orgName={org.org_name || ''} />
          </Suspense>
        )}
      </section>

      <footer className="careers-footer">
        <span>Powered by</span> <strong>intervieHire</strong>
      </footer>
    </main>
  );
}
