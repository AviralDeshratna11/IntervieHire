import { apiListDsarRequests, apiGetDsarRequest } from './api';
import { escapeHTML } from './escape';

// Recruiter-facing Data Rights panel (DPDP Act 2023) — lists candidate data-subject
// requests (access / correction / erasure) for the active organisation and shows each
// one's audit trail on click. Backed by GET /api/privacy/admin/requests[/{id}].
// Follows the mandatory build/bind pairing (see career-panel.js as the reference).

const TYPE_LABELS: Record<string, string> = {
  access_export: 'Access / export',
  erasure: 'Erasure',
  rectification: 'Correction',
};

function labelType(t: string): string {
  return TYPE_LABELS[t] || t || '—';
}

function fmtDate(s?: string): string {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export function buildDsarRequestsPanel(requests: any[]): string {
  if (!requests.length) {
    return '<p class="panel-desc">No data-rights requests yet. When a candidate submits an access, correction, or deletion request, it appears here.</p>';
  }
  const rows = requests
    .map(
      (r) => `
    <tr class="dsar-row" data-id="${escapeHTML(r.request_id)}" style="cursor:pointer;border-top:1px solid rgba(255,255,255,0.08);">
      <td style="padding:10px 8px;">${escapeHTML(r.subject_email)}</td>
      <td style="padding:10px 8px;">${escapeHTML(labelType(r.request_type))}</td>
      <td style="padding:10px 8px;">${escapeHTML(r.scope)}</td>
      <td style="padding:10px 8px;">${escapeHTML(r.status)}${r.overdue ? ' <span style="color:#f87171;font-weight:600;">· overdue</span>' : ''}</td>
      <td style="padding:10px 8px;">${fmtDate(r.due_at)}</td>
      <td style="padding:10px 8px;">${fmtDate(r.created_at)}</td>
    </tr>`,
    )
    .join('');
  return `
    <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
      <thead><tr style="opacity:0.7;">
        <th style="padding:8px;">Subject</th><th style="padding:8px;">Type</th>
        <th style="padding:8px;">Scope</th><th style="padding:8px;">Status</th>
        <th style="padding:8px;">Due</th><th style="padding:8px;">Requested</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div id="dsar-detail" style="margin-top:16px;"></div>`;
}

function buildDsarDetail(d: any): string {
  const r = (d && d.request) || {};
  const trail = ((d && d.audit_trail) || [])
    .map(
      (a: any) => `<li style="padding:4px 0;"><strong>${escapeHTML(a.action)}</strong>
        <span style="opacity:0.6;">· ${escapeHTML(a.actor_type || '')} · ${fmtDate(a.created_at)}</span></li>`,
    )
    .join('');
  return `
    <div class="card-glass" style="padding:16px;">
      <h4 class="panel-title">${escapeHTML(r.subject_email || '')}</h4>
      <p class="panel-desc">${escapeHTML(labelType(r.request_type))} · ${escapeHTML(r.scope || '')} · ${escapeHTML(r.status || '')}</p>
      <h5 style="margin:12px 0 6px;">Audit trail</h5>
      <ul style="list-style:none;padding:0;margin:0;">${trail || '<li style="opacity:0.6;">No audit entries.</li>'}</ul>
    </div>`;
}

export function bindDsarRequestsPanel(root: HTMLElement | null): void {
  if (!root) return;
  root.querySelectorAll('.dsar-row').forEach((row) => {
    row.addEventListener('click', async () => {
      const id = row.getAttribute('data-id');
      const detail = document.getElementById('dsar-detail');
      if (!id || !detail) return;
      detail.innerHTML = '<p class="panel-desc">Loading…</p>';
      try {
        const d = await apiGetDsarRequest(id);
        detail.innerHTML = buildDsarDetail(d);
      } catch (e) {
        detail.innerHTML = `<p class="panel-desc">Couldn't load: ${escapeHTML((e as Error).message)}</p>`;
      }
    });
  });
}

// Render entry point (build → bind, always paired). Called from navigateToTab().
export async function renderDataRights(): Promise<void> {
  const container = document.getElementById('dsar-requests-list');
  if (!container) return;
  container.innerHTML = '<p class="panel-desc">Loading…</p>';
  let requests: any[] = [];
  try {
    requests = await apiListDsarRequests();
  } catch (e) {
    container.innerHTML = `<p class="panel-desc">Couldn't load requests: ${escapeHTML((e as Error).message)}</p>`;
    return;
  }
  container.innerHTML = buildDsarRequestsPanel(requests);
  bindDsarRequestsPanel(container);
}
