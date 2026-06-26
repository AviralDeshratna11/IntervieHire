// Shared HTML-escaping helper. Every module that interpolates user-supplied or
// AI-generated text into an innerHTML template literal MUST run it through this
// first — resume/CSV content and LLM output are untrusted and persist in
// localStorage, so an unescaped value is stored XSS.
export function escapeHTML(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Human-readable label for how a candidate was added (the "Source" column). Keyed
// by the backend `entry_method` value (independent of the stage-routing `source`).
// Unknown / null (legacy rows added before entry_method existed) → em-dash.
export const SOURCE_LABELS = {
  bulk_upload: 'Bulk Upload',
  ats: 'ATS',
  direct_link: 'Direct',
  career_page: 'Career Page',
};

export function sourceLabel(method) {
  return SOURCE_LABELS[method] || '—';
}
