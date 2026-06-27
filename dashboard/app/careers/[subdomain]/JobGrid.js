'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// "location · job_type · experience_band" with the empty parts dropped.
function metaLine(job) {
  return [job.location, job.job_type, job.experience_band].filter(Boolean).join(' · ');
}

export default function JobGrid({ jobs, orgName }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openId, setOpenId] = useState(null);

  // Deep link: open the drawer when ?job=<id> matches a listed role (on mount /
  // back-forward nav). Removing the param closes the drawer.
  useEffect(() => {
    const jobParam = searchParams.get('job');
    if (jobParam && jobs.some((j) => String(j.id) === String(jobParam))) {
      setOpenId(String(jobParam));
    } else if (!jobParam) {
      setOpenId(null);
    }
  }, [searchParams, jobs]);

  const updateUrl = useCallback((id) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set('job', id);
    else params.delete('job');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const openJob = useCallback((id) => { setOpenId(id); updateUrl(id); }, [updateUrl]);
  const closeJob = useCallback(() => { setOpenId(null); updateUrl(null); }, [updateUrl]);

  // Esc to close.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => { if (e.key === 'Escape') closeJob(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, closeJob]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.body.style.overflow = openId ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  const openJobObj = jobs.find((j) => String(j.id) === String(openId)) || null;

  return (
    <>
      <div className="careers-grid">
        {jobs.map((job) => {
          const meta = metaLine(job);
          return (
            <button
              type="button"
              key={job.id}
              className="career-card"
              onClick={() => openJob(String(job.id))}
            >
              <h3 className="career-card-title">{job.title || job.role_name || 'Open role'}</h3>
              {meta ? <div className="career-card-meta">{meta}</div> : null}
              {job.description ? (
                <p className="career-card-desc">{job.description}</p>
              ) : (
                <p className="career-card-desc career-card-desc-empty">No description provided.</p>
              )}
              <span className="career-card-cta">View role →</span>
            </button>
          );
        })}
      </div>

      <div
        className={`career-drawer-overlay${openJobObj ? ' open' : ''}`}
        onClick={closeJob}
        aria-hidden={!openJobObj}
      >
        <aside
          className={`career-drawer${openJobObj ? ' open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={openJobObj ? (openJobObj.title || openJobObj.role_name || 'Role details') : 'Role details'}
          onClick={(e) => e.stopPropagation()}
        >
          {openJobObj ? (
            <>
              <div className="career-drawer-bar">
                <button type="button" className="career-drawer-close" onClick={closeJob} aria-label="Close">×</button>
              </div>
              <div className="career-drawer-body">
                {orgName ? <div className="career-drawer-org">{orgName}</div> : null}
                <h2 className="career-drawer-title">{openJobObj.title || openJobObj.role_name || 'Open role'}</h2>
                {metaLine(openJobObj) ? <div className="career-drawer-meta">{metaLine(openJobObj)}</div> : null}
                <div className="career-drawer-desc">
                  {openJobObj.description || 'No description provided for this role.'}
                </div>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </>
  );
}
