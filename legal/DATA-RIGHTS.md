# Candidate Data Rights — Runbook & Policy (DPDP Act 2023)

Operational reference for IntervieHire's candidate self-serve data-rights feature. Covers
access/export, correction, erasure, grievance, and audit. **Engineering/ops doc — not legal
advice; confirm statutory timelines and obligations against the current DPDP Rules and with
counsel** (incl. whether any client org is a "Significant Data Fiduciary").

See `DSAR-PLAN.md` (repo root) for the design rationale and `api.md` for exact endpoint schemas.

## The flow (self-serve)

1. Candidate opens **`/data-rights`** in the interview web app (or the "Manage your data" link
   in the consent gate / invite email, which forwards `?ih_invite=<token>` to pin the request
   to that company).
2. They submit → `POST /api/privacy/requests` → we email a **one-time verification link**
   (identity = possession of the inbox; only the token hash is stored).
3. Clicking the link (`GET /api/privacy/requests/verify`):
   - **access/export** → a single-use link to download a ZIP of all their data;
   - **correction** → the change is applied across stores immediately;
   - **erasure** → a **second explicit confirmation** page; confirming runs the anonymise.
4. Every step is written to `compliance_audit_logs`. Recruiters see requests in the dashboard
   **Data Rights** tab (`GET /api/privacy/admin/requests`), scoped to their organisation.

## Endpoints (schemas in `api.md`)

Public: `POST /requests`, `GET /requests/verify`, `POST /requests/{id}/confirm`,
`GET /requests/{id}/status`, `GET /exports/{id}`, `POST /grievances` (all under `/api/privacy`,
rate-limited). Admin (auth): `GET /admin/requests`, `GET /admin/requests/{id}`.
Internal (engine, shared-secret): `POST /internal/data-rights/erase-files`.

## Config / env (set before enabling)

| Var | Where | Purpose |
|---|---|---|
| `INTERNAL_SERVICE_SECRET` | backend **and** engine | shared secret for the files-erase call |
| `ENGINE_API_URL` | backend | engine base URL for the internal call |
| `NEXT_PUBLIC_BACKEND_URL` | engine web | FastAPI backend URL the portal posts to (the web app's `NEXT_PUBLIC_API_URL` points at the engine) |
| `DSAR_SLA_DAYS` (30) | backend | response SLA → `due_at`; overdue requests flagged to the org |
| `DSAR_TOKEN_TTL_HOURS` (48) | backend | verification / export link lifetime |
| `DPO_CONTACT_EMAIL` | backend | published grievance contact (DPDP §13) |

## What erasure does — anonymise-in-place

We keep a **non-identifying skeleton** (ids, job link, numeric scores, status, dates) and
scrub everything identifying, across every store:
- **applicants** → name/email/phone/resume/remarks scrubbed, `anonymised_at` stamped; scores kept.
- **interview_reports** → transcript/summary/video stripped; numeric `detailed_scores` kept.
- **interview_invites** → deleted.
- **engine Candidate** → deleted; DB-cascades its InterviewSession → TranscriptEvent /
  InterviewTranscript / ProctoringLog (verbatim transcript + evaluation gone).
- **ConsentLog** → **kept** as proof of consent, with identifiers stripped and
  `erasedForRequestId` set (a compliance record with no residual PII).
- **On-disk files** → resume (backend), transcript `.txt` + recordings (engine) unlinked.

Recruiter "delete applicant" uses the same anonymise, scoped to that single application.

## Known caveats

- **Client-side copy:** the candidate's browser `localStorage ih_consent_*` clears on that
  device only — it can't be erased server-side. Disclosed in the completion email + policy.
- **Retention / auto-purge:** implemented but **disabled by default** — set `RETENTION_DAYS`
  (>0) to enable. Candidates past the retention window (and not mid-pipeline) are anonymised
  in place via the same path as erasure. Trigger `python -m app.jobs.retention` from a host
  cron (e.g. a Render Cron Job), or `POST /api/privacy/internal/run-retention` (x-internal-secret)
  from an external pinger. **Both default to dry-run** — run dry first to review the selection,
  then arm (`python -m app.jobs.retention` without `--dry-run`, or `?dry_run=false`). Bounded
  per run by `RETENTION_MAX_PER_RUN`.
- **Ephemeral filesystem:** disk files may already be gone (Railway/Render wipe `uploads/`);
  erasure is idempotent and tolerates missing files.

## Grievance & SLA (DPDP §13)

Grievances go to `DPO_CONTACT_EMAIL` and are audited. Every request carries a `due_at`;
surface overdue ones to the org. A Data Principal may escalate to the Data Protection Board
only after using this channel.

## Verifying a deployment

```bash
# backend logic + HTTP flow (needs a throwaway Postgres)
cd backend && TEST_DATABASE_URL=postgresql://…/ih_test pytest tests/ -v
python -c "import main"                 # wiring/import
# engine + web + dashboard typecheck/build
cd interview-engine && npm run build -w apps/api && npm run build -w apps/web
cd dashboard && npm run build
```

## Drop-in privacy-policy paragraph (draft — review with counsel)

> **Your rights over your data.** You can access a copy of the personal data we hold about
> you, ask us to correct it, or ask us to delete it, at any time — visit **/data-rights** or
> use the "Manage your data" link in your interview. We'll email you a link to confirm it's
> you before acting. Deletion is permanent and removes your interview transcript, evaluation,
> and uploaded documents; we retain a minimal, anonymised record that you consented and were
> later erased, as required to demonstrate compliance. For any concern, contact our grievance
> officer at <privacy@interviehire.com>; you may also approach the Data Protection Board of
> India if unsatisfied.
