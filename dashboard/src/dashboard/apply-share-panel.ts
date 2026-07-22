import { document, window } from './runtime';
import { AppState } from './state';
import { escapeHTML } from './escape';
import { isApiMode, apiSetApplicationsClose } from './api';
import { showPremiumToast } from './sourcing';

// "Apply link / share" panel for the job-detail Overview tab. Gives the recruiter
// their per-job public apply link (direct + careers-scoped), a QR code, a
// copy-paste embed button for their own website, and an optional "applications
// close" deadline — all pointing at the backend-hosted apply page (public.py), so
// candidate data flows straight into this pipeline.
//
// Two deliberate behaviours:
//   1. FULL, BRANDED link. The link is an absolute URL rooted at
//      NEXT_PUBLIC_PUBLIC_BASE_URL (default https://interviehire.com), NOT the raw
//      API_BASE — which may be a relative "/api" (first-party proxy) or a bare
//      Render host. So the recruiter always copies e.g.
//      https://interviehire.com/api/public/apply/{jobId}.
//   2. GENERATE ON DEMAND. Nothing is built until the recruiter clicks "Get apply
//      link" — the QR is rendered client-side from a dynamically-imported lib
//      (`qrcode`, no third-party service, no bundle cost until reveal). This keeps
//      opening a job instant even across many jobs, instead of eagerly building a
//      QR + link for every one.
//
// Follows the dashboard build→bind pairing: renderApplyShare() fills the static
// #jd-apply-share shell and ALWAYS calls bindApplyShare() so the buttons are live.
// Revealed/expiry state is kept on the container's dataset so it survives the
// applicant-hydrate re-render (renderJobDetailPanes runs more than once per open).

// Public origin for candidate-facing links. Referenced directly so Next.js inlines
// the configured value into the browser bundle (a typeof-process guard would be
// dead-code-eliminated and silently drop it). Defaults to the dashboard origin,
// which ALREADY proxies /api/public/* to the backend first-party (next.config.js
// rewrites) — so the link works with zero extra infra. Override the env to a
// branded apex (interviehire.com) only once that host also forwards /api/* to the
// backend.
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_PUBLIC_BASE_URL || 'https://app.interviehire.com').replace(/\/+$/, '');

function directApplyUrl(jobId: string): string {
  return `${PUBLIC_BASE}/api/public/apply/${jobId}`;
}
function careersApplyUrl(sub: string, jobId: string): string {
  return `${PUBLIC_BASE}/api/public/careers/${encodeURIComponent(sub)}/apply/${jobId}`;
}

// ── expiry helpers ─────────────────────────────────────────────────────────────
// Stored value is a UTC ISO string (or null). datetime-local inputs speak local
// wall-clock with no zone, so convert on the way in/out.
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localInputToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
function formatDeadline(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
function isClosed(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return !isNaN(d.getTime()) && d.getTime() <= Date.now();
}

function copyRow(label: string, value: string, id: string): string {
  const v = escapeHTML(value);
  return `
    <div class="apply-share-row" style="margin:12px 0;">
      <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:5px;">${escapeHTML(label)}</label>
      <div style="display:flex;gap:8px;">
        <input id="${escapeHTML(id)}" type="text" readonly value="${v}"
          style="flex:1;min-width:0;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(2,6,23,0.5);color:#e2e8f0;font-size:13px;" />
        <button type="button" class="btn-copy-share" data-copy-target="${escapeHTML(id)}"
          style="padding:10px 16px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;">Copy</button>
      </div>
    </div>`;
}

const HEADER = `
  <div class="jd-panel-header" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange, #38bdf8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    <h3 class="jd-card-title">Apply link &amp; share</h3>
  </div>`;

// Small status line about whether the link is live / expired — shown collapsed too.
function statusLine(job: any): string {
  const isLive = job.status === 'published' && job.listedOnCareer === true;
  const closeAt = job.applicationsCloseAt || null;
  if (!isLive) {
    return `<div style="margin:2px 0 12px;padding:9px 12px;border-radius:8px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;font-size:12px;">Publish this job and list it on your career page to activate the link.</div>`;
  }
  if (isClosed(closeAt)) {
    return `<div style="margin:2px 0 12px;padding:9px 12px;border-radius:8px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.3);color:#f87171;font-size:12px;">Applications closed on ${escapeHTML(formatDeadline(closeAt))}. Clear the deadline below to reopen.</div>`;
  }
  if (closeAt) {
    return `<div style="margin:2px 0 12px;padding:9px 12px;border-radius:8px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.22);color:#34d399;font-size:12px;">Open — applications close ${escapeHTML(formatDeadline(closeAt))}.</div>`;
  }
  return `<div style="margin:2px 0 12px;padding:9px 12px;border-radius:8px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.22);color:#34d399;font-size:12px;">Open — this link stays live while the job is published &amp; listed.</div>`;
}

// Collapsed view: no external fetches, one primary button.
function buildCollapsed(job: any): string {
  return `
    ${HEADER}
    <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;">Share one link wherever candidates apply — your website, LinkedIn, email, or a QR. Applicants land on your hosted apply page and flow straight into this pipeline.</p>
    ${statusLine(job)}
    <button type="button" id="apply-reveal" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.14);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      Get apply link &amp; QR
    </button>`;
}

// Expiry editor block (only in API mode — needs a backend job to persist to).
function expiryBlock(job: any): string {
  if (!isApiMode || !job._backend) return '';
  const closeAt = job.applicationsCloseAt || null;
  const val = escapeHTML(isoToLocalInput(closeAt));
  const clearBtn = closeAt
    ? `<button type="button" id="apply-expiry-clear" style="padding:9px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:#cbd5e1;font-size:13px;cursor:pointer;white-space:nowrap;">Clear</button>`
    : '';
  return `
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);">
      <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:5px;">Stop accepting applications after (optional)</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <input id="apply-expiry" type="datetime-local" value="${val}"
          style="flex:1;min-width:200px;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(2,6,23,0.5);color:#e2e8f0;font-size:13px;" />
        <button type="button" id="apply-expiry-save" style="padding:9px 16px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.14);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;">Save deadline</button>
        ${clearBtn}
      </div>
      <p style="color:#64748b;font-size:11px;margin:6px 0 0;">Leave empty to keep the link open for as long as the job is published &amp; listed. After the deadline, the apply page shows a “closed” message.</p>
    </div>`;
}

// Revealed view: links + embed + QR + expiry.
function buildRevealed(job: any): string {
  const jobId = String(job.id);
  const role = escapeHTML(job.roleName || job.cardName || 'this role');
  const sub = (AppState.careerSubdomain || '').trim();

  const direct = directApplyUrl(jobId);
  const careers = sub ? careersApplyUrl(sub, jobId) : '';

  const embed = `<a href="${escapeHTML(direct)}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 24px;background:#38bdf8;color:#0f172a;font-weight:600;border-radius:8px;text-decoration:none;font-family:sans-serif;">Apply for ${role}</a>`;

  return `
    ${HEADER}
    <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;">Share this link wherever candidates apply. Applicants land on your hosted apply page and flow straight into this pipeline.</p>
    ${statusLine(job)}
    <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;">
      <div style="flex:1;min-width:280px;">
        ${copyRow('Direct apply link (LinkedIn, email, QR)', direct, 'apply-url-direct')}
        ${careers ? copyRow('Careers-page apply link', careers, 'apply-url-careers') : ''}
        <div class="apply-share-row" style="margin:12px 0;">
          <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:5px;">Embed button (paste into your website)</label>
          <div style="display:flex;gap:8px;">
            <textarea id="apply-embed" readonly rows="3"
              style="flex:1;min-width:0;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(2,6,23,0.5);color:#e2e8f0;font-size:12px;font-family:monospace;resize:vertical;">${escapeHTML(embed)}</textarea>
            <button type="button" class="btn-copy-share" data-copy-target="apply-embed"
              style="padding:10px 16px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;align-self:flex-start;">Copy</button>
          </div>
        </div>
      </div>
      <div style="text-align:center;">
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;">QR code</label>
        <canvas id="apply-qr" width="150" height="150"
          style="border-radius:8px;background:#fff;padding:6px;width:150px;height:150px;box-sizing:content-box;"
          role="img" aria-label="Apply QR code"></canvas>
        <div style="margin-top:8px;">
          <button type="button" id="apply-qr-download"
            style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:#cbd5e1;font-size:12px;font-weight:600;cursor:pointer;">Download QR</button>
        </div>
      </div>
    </div>
    ${expiryBlock(job)}`;
}

export function buildApplyShare(job: any, revealed: boolean): string {
  return revealed ? buildRevealed(job) : buildCollapsed(job);
}

export function bindApplyShare(root: any, job: any): void {
  if (!root) return;

  // Reveal: swap to the full view (this is when the QR + links are first built).
  const reveal = root.querySelector('#apply-reveal');
  if (reveal) {
    reveal.addEventListener('click', () => {
      root.dataset.revealed = '1';
      root.innerHTML = buildApplyShare(job, true);
      bindApplyShare(root, job);
    });
  }

  // QR code — generated fully client-side (no third-party service). The lib is
  // dynamic-imported so it only loads when the panel is actually revealed, keeping
  // it off the initial bundle. Also wires a "Download QR" (PNG) button.
  const qrCanvas = root.querySelector('#apply-qr');
  if (qrCanvas) {
    const jobId = String(job.id);
    const direct = directApplyUrl(jobId);
    import('qrcode')
      .then((mod: any) => {
        const QR = mod && (mod.default || mod);
        if (QR && typeof QR.toCanvas === 'function') {
          QR.toCanvas(qrCanvas, direct, { width: 150, margin: 1, errorCorrectionLevel: 'M' }, () => { /* drawn */ });
        }
      })
      .catch(() => {
        // Lib unavailable (shouldn't happen once bundled) — leave a hint instead of a blank box.
        qrCanvas.setAttribute('aria-label', 'QR unavailable — copy the link above instead.');
      });

    const dl = root.querySelector('#apply-qr-download');
    if (dl) {
      dl.addEventListener('click', () => {
        try {
          const url = qrCanvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `apply-qr-${jobId}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {
          showPremiumToast('Could not export the QR image.', 'error');
        }
      });
    }
  }

  // Copy buttons.
  root.querySelectorAll('.btn-copy-share').forEach((btn: any) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const field = targetId && document.getElementById(targetId);
      if (!field) return;
      const text = field.value != null ? field.value : '';
      try {
        await window.navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        window.setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (e) {
        // Clipboard blocked (insecure context / permissions) — select for manual copy.
        if (typeof field.select === 'function') field.select();
      }
    });
  });

  // Expiry: save / clear the deadline, then re-render this panel from the updated job.
  const saveBtn = root.querySelector('#apply-expiry-save');
  const clearBtn = root.querySelector('#apply-expiry-clear');
  const rerender = () => { root.innerHTML = buildApplyShare(job, true); bindApplyShare(root, job); };

  async function persist(iso: string | null, btn: any, doneLabel: string) {
    if (!job._backend) { showPremiumToast('Connect the live backend to set an apply deadline.', 'error'); return; }
    const original = btn.textContent;
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
      await apiSetApplicationsClose(String(job.id), iso);
      job.applicationsCloseAt = iso;               // keep local job in sync
      showPremiumToast(doneLabel, 'success');
      rerender();
    } catch (e: any) {
      btn.textContent = original; btn.disabled = false;
      showPremiumToast(`Could not update the deadline: ${(e && e.message) || 'backend error'}`, 'error');
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const input = root.querySelector('#apply-expiry');
      const iso = localInputToIso(input ? input.value : '');
      if (!iso) { showPremiumToast('Pick a date and time, or use Clear to remove the deadline.', 'error'); return; }
      if (new Date(iso).getTime() <= Date.now()
        && !window.confirm('That time is in the past — the apply link will be closed immediately. Continue?')) return;
      persist(iso, saveBtn, 'Apply deadline saved.');
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => persist(null, clearBtn, 'Apply deadline cleared — link reopened.'));
  }
}

// Hydrate / re-render entry point. No-op when the Overview shell isn't mounted.
// Revealed state lives on the container dataset so it survives re-renders; it
// resets when the open job changes.
export function renderApplyShare(job: any): void {
  const container = document.getElementById('jd-apply-share');
  if (!container || !job) return;
  const jobId = String(job.id);
  if (container.dataset.jobId !== jobId) {
    container.dataset.jobId = jobId;
    container.dataset.revealed = '';
  }
  const revealed = container.dataset.revealed === '1';
  container.innerHTML = buildApplyShare(job, revealed);
  bindApplyShare(container, job);
}
