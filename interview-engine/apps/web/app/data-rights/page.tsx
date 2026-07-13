'use client';

/**
 * Public candidate self-serve data-rights portal (DPDP Act 2023).
 *
 * Lets a Data Principal ask to access (export), correct, or erase their data. Submitting
 * emails them a one-time verification link (handled by the FastAPI backend); this page only
 * collects and posts the request. No auth — identity is proven later via the emailed token.
 *
 * Talks to the FastAPI BACKEND (not the interview engine), so it uses NEXT_PUBLIC_BACKEND_URL
 * — the web app's NEXT_PUBLIC_API_URL points at the engine on :4000.
 */
import { useEffect, useState } from 'react';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

type RequestType = 'access_export' | 'erasure' | 'rectification';
type Scope = 'company' | 'platform';

const TYPES: { value: RequestType; label: string; blurb: string }[] = [
  { value: 'access_export', label: 'Get a copy of my data', blurb: 'Download everything we hold about you.' },
  { value: 'rectification', label: 'Correct my details', blurb: 'Fix your name, phone, or email.' },
  { value: 'erasure', label: 'Delete my data', blurb: 'Permanently erase your data. This cannot be undone.' },
];

export default function DataRightsPortal() {
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('access_export');
  const [scope, setScope] = useState<Scope>('company');
  const [rName, setRName] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rEmail, setREmail] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  // Pin the request to the candidate's company when they arrive from an invite link.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setInviteToken(p.get('ih_invite') || p.get('invite_token') || '');
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('sending');
    try {
      const body: Record<string, unknown> = {
        email,
        request_type: requestType,
        scope,
        invite_token: inviteToken || undefined,
      };
      if (requestType === 'rectification') {
        body.rectification = {
          ...(rName ? { name: rName } : {}),
          ...(rPhone ? { phone: rPhone } : {}),
          ...(rEmail ? { email: rEmail } : {}),
        };
      }
      const res = await fetch(`${BACKEND_URL}/api/privacy/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.detail || 'Something went wrong. Please try again.');
      }
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold text-ink">Check your email</h1>
        <p className="mt-4 text-slate-600">
          We&apos;ve sent a verification link to <strong>{email}</strong>. Click it to confirm it was
          you, and we&apos;ll {requestType === 'erasure' ? 'ask you to confirm the deletion' : 'process your request'}.
        </p>
        <p className="mt-3 text-sm text-slate-500">The link expires in 48 hours. Didn&apos;t get it? Check spam, or submit again.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-2xl font-semibold text-ink">Manage your data</h1>
      <p className="mt-3 text-slate-600">
        Under India&apos;s Digital Personal Data Protection Act, you can access, correct, or delete
        the personal data IntervieHire holds about you. Tell us what you&apos;d like to do.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-ink">Your email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
          />
          <p className="mt-1 text-xs text-slate-500">Use the same email you applied with.</p>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">What would you like to do?</legend>
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                requestType === t.value ? 'border-brand bg-mint/40' : 'border-slate-200'
              }`}
            >
              <input
                type="radio"
                name="request_type"
                checked={requestType === t.value}
                onChange={() => setRequestType(t.value)}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-ink">{t.label}</span>
                <span className="block text-sm text-slate-500">{t.blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {requestType === 'rectification' && (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Leave a field blank to keep it unchanged.</p>
            <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Corrected name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <input value={rPhone} onChange={(e) => setRPhone(e.target.value)} placeholder="Corrected phone"
              className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <input value={rEmail} onChange={(e) => setREmail(e.target.value)} placeholder="Corrected email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </div>
        )}

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">Which records?</legend>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="radio" name="scope" checked={scope === 'company'} onChange={() => setScope('company')} />
            <span className="text-sm text-slate-700">Just the company I applied to</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="radio" name="scope" checked={scope === 'platform'} onChange={() => setScope('platform')} />
            <span className="text-sm text-slate-700">Every company on IntervieHire that has my data</span>
          </label>
        </fieldset>

        {inviteToken && (
          <p className="text-xs text-slate-500">✓ Linked to your interview invitation.</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-ink px-6 py-3 font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send verification email'}
        </button>
      </form>

      <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
        We&apos;ll email you a link to confirm it&apos;s really you before acting on any request. Have a
        complaint? Contact our grievance officer at privacy@interviehire.com.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cream px-4 py-12">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        {children}
      </div>
    </main>
  );
}
