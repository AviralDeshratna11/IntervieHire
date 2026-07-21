import { document, window } from './runtime';
import { AppState } from './state';
import { escapeHTML } from './escape';
import { API_BASE } from '../auth-client';

// "Apply link / share" panel for the job-detail Overview tab. Gives the recruiter
// their per-job public apply links (direct link + careers-scoped link), a QR code,
// and a copy-paste embed button for their own website — all pointing at the
// backend-hosted apply page (public.py), so candidate data flows straight to us.
//
// Leaf module (imports only AppState + escapeHTML + API_BASE), following the
// dashboard build→bind pairing: renderApplyShare() fills the static #jd-apply-share
// shell and ALWAYS calls bindApplyShare() so the copy buttons are live.

// API_BASE already ends in `/api` (e.g. https://api.interviehire.com/api), so the
// public apply routes hang off `/public/...` beneath it.
function directApplyUrl(jobId: string): string {
  return `${API_BASE}/public/apply/${jobId}`;
}
function careersApplyUrl(sub: string, jobId: string): string {
  return `${API_BASE}/public/careers/${encodeURIComponent(sub)}/apply/${jobId}`;
}

function copyRow(label: string, value: string, id: string): string {
  const v = escapeHTML(value);
  return `
    <div class="apply-share-row" style="margin:10px 0;">
      <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;">${escapeHTML(label)}</label>
      <div style="display:flex;gap:8px;">
        <input id="${escapeHTML(id)}" type="text" readonly value="${v}"
          style="flex:1;min-width:0;padding:9px 11px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(2,6,23,0.5);color:#e2e8f0;font-size:13px;" />
        <button type="button" class="btn-copy-share" data-copy-target="${escapeHTML(id)}"
          style="padding:9px 14px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;">Copy</button>
      </div>
    </div>`;
}

export function buildApplyShare(job: any): string {
  const jobId = String(job.id);
  const role = escapeHTML(job.roleName || job.cardName || 'this role');
  const sub = (AppState.careerSubdomain || '').trim();

  const direct = directApplyUrl(jobId);
  const careers = sub ? careersApplyUrl(sub, jobId) : '';

  // The public apply route 404s unless the job is listed AND published (mirrors
  // public.py's gate). Warn — but still show the link so it's ready to paste.
  const isLive = job.status === 'published' && job.listedOnCareer === true;
  const liveNote = isLive
    ? ''
    : `<div style="margin:2px 0 12px;padding:9px 12px;border-radius:8px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;font-size:12px;">Publish this job and list it on your career page to activate these links.</div>`;

  // Copy-paste button the client drops onto their own careers page.
  const embed = `<a href="${escapeHTML(direct)}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 24px;background:#38bdf8;color:#0f172a;font-weight:600;border-radius:8px;text-decoration:none;font-family:sans-serif;">Apply for ${role}</a>`;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(direct)}`;

  return `
    <div class="jd-panel-header" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange, #38bdf8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      <h3 class="jd-card-title">Apply link &amp; share</h3>
    </div>
    <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;">Share this link wherever candidates apply — your website, LinkedIn, email, or the QR below. Applicants land on your hosted apply page and flow straight into this pipeline.</p>
    ${liveNote}
    <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;">
      <div style="flex:1;min-width:280px;">
        ${copyRow('Direct apply link (LinkedIn, email, QR)', direct, 'apply-url-direct')}
        ${careers ? copyRow('Careers-page apply link', careers, 'apply-url-careers') : ''}
        <div class="apply-share-row" style="margin:10px 0;">
          <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;">Embed button (paste into your website)</label>
          <div style="display:flex;gap:8px;">
            <textarea id="apply-embed" readonly rows="3"
              style="flex:1;min-width:0;padding:9px 11px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(2,6,23,0.5);color:#e2e8f0;font-size:12px;font-family:monospace;resize:vertical;">${escapeHTML(embed)}</textarea>
            <button type="button" class="btn-copy-share" data-copy-target="apply-embed"
              style="padding:9px 14px;border-radius:8px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.12);color:#38bdf8;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;align-self:flex-start;">Copy</button>
          </div>
        </div>
      </div>
      <div style="text-align:center;">
        <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;">QR code</label>
        <img src="${escapeHTML(qrSrc)}" alt="Apply QR code" width="150" height="150"
          style="border-radius:8px;background:#fff;padding:6px;" loading="lazy" />
      </div>
    </div>`;
}

export function bindApplyShare(root: any): void {
  if (!root) return;
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
        // Clipboard blocked (insecure context / permissions) — select the field so
        // the user can copy manually.
        if (typeof field.select === 'function') field.select();
      }
    });
  });
}

// Hydrate / re-render entry point. No-op when the Overview shell isn't mounted.
export function renderApplyShare(job: any): void {
  const container = document.getElementById('jd-apply-share');
  if (!container || !job) return;
  container.innerHTML = buildApplyShare(job);
  bindApplyShare(container);
}
