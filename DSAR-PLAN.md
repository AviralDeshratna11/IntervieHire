# DSAR / Candidate Data-Rights — Design Plan

> **Status:** design only, no code yet. Request model: **candidate self-serve**
> (tokenized email links + emailed one-time-token verification).
> **Governing law:** India's **DPDP Act 2023** (see §1A).
> **Locked decisions:** D2 anonymize consent record · D3 candidate picks *company* or
> *whole-platform* scope · D6 automatic erasure on double-confirm.
> **Suggested branch:** `feat/data-rights` off `main` (distinct from `feat/exit-interviews`).
> Covers the five checklist items: request path, identity verification, erasure,
> export, correction + audit log.

---

## 1. Current state (what we build on / around)

**Already built — reuse, don't rebuild:**
- Full candidate **consent capture**: client gate + engine `ConsentLog` store
  (`interview-engine/apps/web/app/interviewcandidateroom/page.tsx`, `POST /consent`
  at `interview.routes.ts:316`). Captures IP/UA/scopes incl. separate biometric consent.
- An **audited hard-delete + opt-out** pattern, but only for *sourced* candidates
  (`talent_finder`): reusable `audit()` helper (`backend/app/talent_finder/service.py:233`)
  + `TalentFinderAuditLog` table + `DELETE /candidates/{id}` (`routes.py:293`). This is
  the template we generalize to the core hiring app.
- Recruiter router/auth conventions, hand-rolled migrations, upload handling.

**The landmine — erasure today is cross-service and broken.**
`delete_applicant` (`backend/app/routers/jobs.py:2321`) does a bare `db.delete()` that:
- **Orphans all engine-side PII.** Backend `applicants` (UUID) and engine
  `Candidate`/`InterviewSession` (cuid) are linked only *softly by email*. Deleting the
  applicant leaves the transcript, the per-answer evaluation (the `CandidateReport`),
  proctoring/gaze logs, and consent record intact in the shared engine DB.
- **Can FK-error.** `interview_invites.applicant_id` has no `ondelete` cascade
  (`backend/app/models/interview_invite.py:38`) → deleting an applicant who has an
  invite raises IntegrityError.
- **Leaves the resume file on disk** (`uploads/resumes/<name>`) — only the DB pointer drops.
- **Isn't audited.**

There is **no general audit log**, **no consolidated export**, **no rectification
endpoint**, and **no retention/auto-purge job** for the core hiring app.

---

## 1A. Governing law — India's DPDP Act 2023

Designed to satisfy the **Digital Personal Data Protection Act, 2023 (DPDP)**.
*Engineering alignment, not legal advice — confirm exact response timelines and duties
against the current DPDP Rules and with counsel, including whether any client org is a
"Significant Data Fiduciary" (which adds DPO/DPIA duties).*

**Roles:**
- **Data Principal** = the candidate.
- **Data Fiduciary** = the hiring company/org (decides why/how data is processed).
- **Data Processor** = the IntervieHire platform + sub-processors (interview engine, and
  the AI model provider used for scoring). This is why a **whole-platform** request means
  the processor fanning it out across *every* Fiduciary that holds the person's data.

**Rights we implement (DPDP §11–14):**
- **§11 Right to access** → export must include, besides the data, a **summary of
  processing and the list of processors/sub-processors** the data was shared with
  (interview engine, AI scoring provider). Our full-copy export exceeds the minimum.
- **§12 Right to correction & erasure** → the rectification + erasure flows.
- **§13 Right of grievance redressal** → **new:** publish a grievance contact (a
  DPO/contact email), acknowledge + respond within the prescribed period; a Data Principal
  may escalate to the Data Protection Board only after using this. Track every request
  against an SLA (`due_at`).
- **§14 Right to nominate** → *deferred* (not in this build; a DPDP-granted right to revisit later).

**Consent (DPDP §6):** withdrawal must be **as easy as giving** consent; on withdrawal the
Fiduciary must stop processing and erase unless law requires retention. So the existing
consent gate gains a **"withdraw consent"** action that triggers the same erasure flow.

**Verifiable request:** the DPDP Rules require the Fiduciary to verify the requester's
identity — our email one-time-token does this.

**Response SLA:** the Rules prescribe response periods for access/correction/erasure/
grievance. Every request gets a `due_at`; overdue ones surface to the org. *(Exact
durations: confirm against the final Rules.)*

**Retention (DPDP §8):** erase once the purpose is served / retention lapses — this makes
the retention/auto-purge job (§13) a **compliance requirement**, not a nice-to-have.

**Children's data (§9):** the consent gate already carries an "18+" attestation; keep it.
Processing a minor's data needs verifiable parental consent — out of scope otherwise.

---

## 2. Data map — every store an erase/export must touch

Keyed by candidate `email` (+ controller `company_id`) and by
`backend Applicant.id == engine InterviewSession.id` (`ai_sync.py:199`).
Candidate↔Candidate link is email-within-company (`ai_sync.py:162-165`) — **no stored FK.**

| Store | Table / path | Link | PII | Cascade today |
|---|---|---|---|---|
| Backend DB | `applicants` | root (`id`, `email`) | name, email, phone, `resume_url`, `resume_text`, `resume_analysis_report`, remarks, exit fields | — |
| Backend DB | `interview_reports` | `applicant_id` | transcript, summary, video_url, detailed_scores | **CASCADE** on applicant delete |
| Backend DB | `interview_invites` | `applicant_id` (nullable) | candidate_email, candidate_name, token | **NO cascade → FK blocker** |
| Backend DB | `candidate_profiles` (+children) | `email`/`id` | sourced-candidate PII | own audited cascade (talent_finder) |
| Engine DB | `Candidate` | `companyId`+`email` | fullName, phone, resumeText, parsedResume, ats* | company-delete only |
| Engine DB | `InterviewSession` | `candidateId`; `id==Applicant.id` | transcript JSON, **evaluation JSON = CandidateReport**, reportUrl | cascades from Candidate |
| Engine DB | `TranscriptEvent` | `sessionId` | per-utterance candidate speech | cascades from session (**not** in backend ORM) |
| Engine DB | `InterviewTranscript` | `sessionId` | `transcriptFilePath` (disk pointer) | cascades from session (**not** in backend ORM) |
| Engine DB | `ProctoringLog` | `sessionId` | gaze / proctoring metadata (biometric-adjacent) | cascades from session |
| Engine DB | `ConsentLog` | `sessionId` (plain string) | candidateEmail, candidateName, ipAddress, userAgent | **NO FK — survives by design** |
| Disk (backend) | `uploads/resumes/<original-name>` | via `applicants.resume_url` | resume file | not touched |
| Disk (engine) | `transcripts/<sessionId>.txt` | sessionId | transcript text | not touched |
| Disk (engine) | `uploads/<ts>-<name>` | filenames inside `InterviewSession.transcript` JSON | audio/video recordings | not touched |
| Client only | `localStorage ih_consent_${sessionId}` | on candidate's device | consent proof | **not server-erasable** |

`CandidateReport` shape: `aviral-eval/types.ts:230-261`; persisted in
`InterviewSession.evaluation` (`transcript-report.service.ts:192-194`).

---

## 3. Architecture decisions (need sign-off before build)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 ✅ | **Erasure ownership** | *locked (built): **backend-DB + engine-files*** | Backend does ALL DB anonymise/erase over the shared Postgres via its mirror models — deleting `Candidate` cascades sessions/transcripts/proctoring at the DB level (confirmed no Prisma `relationMode`), `ConsentLog` anonymised explicitly. Engine exposes a **files-only** `POST /internal/data-rights/erase-files` to unlink on-disk transcripts/recordings it alone can reach. |
| D2 ✅ | **ConsentLog on erasure** | *locked: **anonymize*** | Null `candidateEmail/candidateName/ipAddress/userAgent`; keep `action/version/scopes/timestamp` + `erasedForRequestId`. Proof consent existed, no residual PII. |
| D3 ✅ | **Request scope** | *locked: **candidate chooses both*** | Candidate picks **this company** (one Data Fiduciary) *or* **whole platform** (fan out across every org holding their email). A `scope` field drives it. |
| D4 ✅ | **Applicant row on erasure** | *locked: **anonymized stub*** | Scrub all PII + free-text + media from every store; keep a non-identifying skeleton (ids, job link, numeric scores, status, timestamps) + an `anonymised_at` marker. |
| D5 ✅ | **Self-edit vs recruiter-reviewed** | *locked: **candidate self-edit*** | Candidates edit their own details incl. email; an email change re-keys the engine join, so propagate across both DBs atomically. |
| D6 ✅ | **Erasure human-in-loop** | *locked: **automatic*** | Runs automatically once the candidate double-confirms; recruiter is *notified* and sees it in the admin view. Short cancel/grace window before it executes. |

---

## 4. New schemas

### 4.1 `data_subject_requests` (backend, new table)
| Field | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `subject_email` | str, indexed | claimed data-subject email |
| `request_type` | enum `access_export` \| `erasure` \| `rectification` | |
| `status` | enum `pending_verification` \| `verified` \| `in_progress` \| `fulfilled` \| `rejected` \| `expired` \| `cancelled` | |
| `organisation_id` | UUID, nullable, indexed | controller scope (D3) |
| `verification_token_hash` | str | store hash only; single-use |
| `token_expires_at` | datetime | short TTL (reuse `INVITE_TTL_DAYS` pattern or shorter) |
| `verified_at` | datetime, nullable | |
| `requester_ip` / `requester_user_agent` | str, nullable | captured at intake for audit |
| `payload` | JSONB | rectification diff, or export manifest, or erasure manifest |
| `export_token_hash` / `export_expires_at` | str / datetime, nullable | single-use download link |
| `scope` | enum `company` \| `platform` | company = one Fiduciary; platform = every org holding this email (D3) |
| `due_at` | datetime | DPDP response SLA; overdue requests flagged to the org |
| `notes` | text, nullable | admin annotations |
| `created_at` / `updated_at` / `fulfilled_at` | datetime | |

### 4.2 `compliance_audit_log` (backend, new table — generalizes `TalentFinderAuditLog`)
| Field | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `organisation_id` | UUID, nullable, indexed | |
| `actor_type` | enum `candidate` \| `recruiter` \| `system` \| `admin` | |
| `actor_id` | str, nullable | user id, or subject email for candidate/system |
| `action` | str | e.g. `dsar.request.created`, `dsar.verified`, `dsar.export.fulfilled`, `dsar.erasure.fulfilled`, `applicant.erased`, `applicant.rectified`, `consent.anonymized` |
| `entity_type` / `entity_id` | str | `applicant` / `data_subject_request` / `candidate` |
| `subject_email` | str, nullable, indexed | the data subject the action concerns |
| `detail` | JSONB | stores touched, row counts, files unlinked, redacted rectification diff |
| `request_ip` / `user_agent` | str, nullable | |
| `created_at` | datetime | |

**No cascading FK** (ConsentLog precedent) so the trail outlives erased subjects — this
is the "proof of compliance."

### 4.3 Migrations
Both are **new tables** → `Base.metadata.create_all` builds them once the models are
registered in `backend/app/models/__init__.py` (same as `interview_report.py`). No
`ALTER TABLE` lines needed in `init_db()` (`main.py:14`) unless we later add columns to
existing tables. Engine `ConsentLog` anonymization needs an `erasedForRequestId` column
→ add via a Prisma migration + a double-quoted `ADD COLUMN IF NOT EXISTS` line in
`init_db()` for the shared DB.

---

## 5. API surface (contracts — no implementation)

### Public (candidate self-serve; unauthenticated, hard rate-limited)
- `POST /api/privacy/requests`
  → body `{ email, request_type, scope: "company"|"platform", invite_token?, organisation_id?, rectification?: {name?, phone?} }`
  → creates row (`pending_verification`), emails verification link, returns `{ request_id, status, due_at }`.
- `POST /api/privacy/grievances`
  → body `{ email, request_id?, message }` → files a grievance (DPDP §13), emails an
  acknowledgement, tracked against the SLA.
- `GET /api/privacy/requests/verify?token=…`
  → validates single-use token → `verified`; for export/rectification kicks off
  fulfillment; for erasure returns a confirm step.
- `POST /api/privacy/requests/{id}/confirm?token=…`
  → erasure only: explicit second confirmation → runs erase sequence (§7).
- `GET /api/privacy/requests/{id}/status?token=…` → `{ status, type, updated_at }`.
- `GET /api/privacy/exports/{token}` → raw ZIP/JSON download (single-use, expiring).
  *Dashboard/download must use raw `fetch`+`blob()`, not the JSON `request()` helper.*

### Recruiter/admin (authenticated: `get_current_user` + `get_active_org_id`)
- `GET /api/privacy/admin/requests` → list DSAR requests for the org.
- `GET /api/privacy/admin/requests/{id}` → detail + audit trail.
- (optional) `POST /api/privacy/admin/requests/{id}/action` → annotate / reject / manual-fulfill.

### Internal service-to-service (backend → engine; shared-secret auth, never public)
- `POST /internal/data-rights/export` → engine returns its data for `{ email, companyId, sessionIds }`.
- `POST /internal/data-rights/erase` → engine deletes its rows + files, anonymizes ConsentLog,
  returns a manifest `{ candidatesDeleted, sessionsDeleted, transcriptEventsDeleted, proctoringLogsDeleted, consentLogsAnonymized, filesUnlinked[] }`.

Existing `delete_applicant` is **refactored to call the same erase service**, so recruiter
delete and candidate self-serve erasure share one correct, audited implementation.

**`api.md` obligation:** every route above is added to `api.md` (changelog + full
request/response schema) in the same unit of work as the code, via the dedicated sync
sub-agent. (Nothing to add now — this is a plan.)

---

## 6. Self-serve flow + identity verification

**Preferred entry (strong identity + scope):** a "Manage / delete your data" link in the
invite email footer, the consent gate, and the interview room, carrying the `invite_token`
(→ resolves `organisation_id` + candidate). Email-OTP then confirms inbox possession.
Two factors: *had the invite* + *controls the inbox*.

**Fallback entry (bare email):** candidate enters email with no token → email-OTP proves
inbox possession (email is the primary identifier across all stores, so this is
proportionate for online DSAR). Scope resolved by matching email; if it spans multiple
controllers, present the list or require per-controller confirmation. Gate bare-email
**erasure** behind stricter checks (D6 double-confirm + admin notification).

**Verification mechanics:** reuse the invite/scheduling token pattern — cryptographically
random token, **store only its hash**, single-use, short TTL, rate-limited intake, log
requester IP/UA to the audit log. Erasure = click-verify **then** explicit
"confirm permanent deletion".

---

## 7. Cross-service erasure sequence (the centerpiece — idempotent, resumable, audited)

Given a verified request for `email`:
**Scope (D3):** if `scope == company`, restrict every step to that `organisation_id`. If
`scope == platform`, run the whole sequence **once per org** where the email appears, and
audit each Data Fiduciary separately.
**Erasure = anonymize-in-place (D4):** we don't drop the skeleton rows — we scrub
PII/free-text/media from every store and keep a non-identifying stub (ids, job link,
numeric scores, status, dates, `anonymised_at`). The steps below say "delete" for brevity;
where a row carries reusable analytics it is *scrubbed*, not deleted (per-store policy
lives in the erase service).

**Phase 0 — resolve & manifest (read-only):**
1. Backend: `Applicant` rows where `email == subject_email` (and `job.organisation_id ==
   org` if scoped). Collect ids, `resume_url`s, report ids, invite ids.
2. Engine: `Candidate` where `companyId == org AND email == subject_email`; plus
   `InterviewSession` where `id IN (applicant ids)` **or** `candidateId IN (…)` (union —
   id link is exact, email link is the fallback). Collect session ids, `reportUrl`s,
   `transcriptFilePath`s, recording filenames parsed from each `transcript` JSON.
3. Persist the full manifest on the DSAR request `payload`; audit `dsar.erasure.manifest`.
4. If export-before-erase is required, snapshot the package first (§8).

**Phase 1 — backend DB teardown (one transaction):**
5. Delete `interview_invites` for these applicants (**must precede** applicant delete — FK blocker).
6. Delete `applicants` → `interview_reports` cascades automatically.
7. If the email also exists as a `candidate_profiles` row for this org, erase via the
   existing audited talent_finder cascade.
8. Commit.

**Phase 2 — backend disk teardown:** `os.remove` each `resume_url` (ignore missing);
remove any local `report_url` files.

**Phase 3 — engine teardown (D1: backend does the DB, engine does its files):**
- Engine files, called **FIRST** (before any row delete, so each session still resolves its
  recordings): `POST /internal/data-rights/erase-files { sessionIds }` unlinks each
  `transcripts/<sessionId>.txt` (both dir helpers + the stored `transcriptFilePath`) and the
  `type:'recording'` blobs under `uploads/`. Best-effort, idempotent.
- Engine rows (backend, over the shared DB via mirror models):
  - `ConsentLog`: **anonymise** (D2) by `sessionId`/`candidateEmail`, set `erasedForRequestId`.
  - Delete `Candidate` rows → DB cascade removes `InterviewSession` → `TranscriptEvent`,
    `InterviewTranscript`, `ProctoringLog` (verbatim transcript + evaluation gone; numeric
    scores survive on the backend stub).

**Phase 4 — finalize:**
10. Backend writes per-store audit entries from both manifests (`dsar.erasure.fulfilled`).
11. Mark request `fulfilled`, set `fulfilled_at`; email completion confirmation.
12. Confirmation email notes the client-side `localStorage ih_consent_*` clears on that
    device only (not server-erasable).

**Idempotency / failure:** every step is re-runnable (`deleteMany`, ignore-missing-file).
On Phase-3 failure the request stays `in_progress` with the error recorded and is resumable
from the persisted manifest. Never report blanket success — audit records exactly which
stores completed.

---

## 8. Export package spec (right of access + portability)

Assemble and zip:
- `manifest.json` — index, controller identity, `generated_at`, provenance, retention/purpose notes.
- `data.json` — all structured data grouped by store: backend `applicant` (all fields),
  `interview_reports`, `resume_text`; engine `Candidate`, `InterviewSession`
  (`transcript` + `evaluation`=full `CandidateReport`), `TranscriptEvent[]`,
  `InterviewTranscript`, `ProctoringLog`, `ConsentLog` history.
- `/files/` — resume file, `transcripts/<sessionId>.txt`, any recordings still on disk.
- A human-readable `summary.html/md` (fields, sources, purposes, retention) — **plus, per
  DPDP §11, the list of processors/sub-processors the data was shared with** (the interview
  engine and the AI scoring provider).

Served via `GET /api/privacy/exports/{token}` (single-use, expiring). Engine-side data
gathered via `POST /internal/data-rights/export`. For `scope == platform`, the package
holds one section per Data Fiduciary.

---

## 9. Rectification spec

- Candidate submits corrected `{name?, phone?}` (safe subset). Auto-apply to `applicants`;
  propagate to engine `Candidate` (by email) and `interview_invites.candidate_name`.
- **Email changes** re-key the engine join (D5) → queue for recruiter review, don't auto-apply.
- Audit `applicant.rectified` with a redacted before/after diff.

---

## 10. UI

- **Candidate portal** (public) in `interview-engine/apps/web` (Next, already candidate-facing):
  request form → verify landing → erasure confirm → export download → status. Carries the
  scoping `invite_token` when present.
- **Touchpoint links:** invite email footer, consent gate, interview room → "Manage your data".
- **Recruiter admin view** in `dashboard/src/dashboard/` (TS `build*/bind*` pattern; list +
  detail + audit trail). Route the existing per-applicant delete through the new audited erase.
  API wrappers in `dashboard/src/dashboard/api.ts` via `request()` (JSON) / raw `fetch` (blob).

---

## 11. Task breakdown (phased, parallelizable → sub-agents)

**A · Foundations (backend, parallel):**
- A1 `compliance_audit_log` model + register + generalize `audit()` into a shared util.
- A2 `data_subject_requests` model + enums + register.
- A3 Verification/token util (reuse invite-token pattern; hash+TTL+single-use).
- A4 Confirm transactional-email dependency (reuse the invite mailer) — spike.

**B · Actions (backend service layer):**
- B1 Cross-service **erase service** (§7); refactor `delete_applicant` onto it.
- B2 **Export service** (§8) + tokenized download.
- B3 **Rectification service** (§9).
- B4 Engine **internal endpoints** `/internal/data-rights/{export,erase}` (Prisma; secret auth) — separate sub-agent in `interview-engine`.

**C · Public API + intake:**
- C1 `/api/privacy` router (public + admin routes, auth + rate-limit).
- C2 **`api.md` sync** (dedicated sub-agent — changelog + schemas).
- C3 DPDP extras: grievance endpoint (§13), `due_at` SLA stamping + overdue surfacing,
  and a **"withdraw consent" → erasure** hook on the consent gate (§6).

**D · UI:**
- D1 Candidate portal (`apps/web`). D2 Touchpoint links. D3 Recruiter admin view (dashboard).

**E · Docs/policy:**
- E1 Update `legal/` + privacy policy (DSAR process, ConsentLog anonymization posture,
  localStorage caveat, retention note). E2 Ops runbook.

---

## 12. Dependencies & risks (verify before build)

- **Transactional email** — self-serve verification needs a mailer. Confirm the existing
  invite/scheduling email path can be reused (there's an invite-token system already).
- **Prisma relation mode** — §7 Phase-3 uses the engine's own Prisma cascade, so it's
  robust either way; but confirm `schema.prisma` has no `relationMode="prisma"` if any
  path deletes engine rows from the backend (Option A).
- **Ephemeral filesystem** — Railway/Render wipe `uploads/` on restart; disk deletes must
  ignore-missing (DB pointers may already dangle). Export must tolerate absent files.
- **Cross-company email** — one email can span controllers; keep requests per-controller (D3).
- **Client localStorage** — `ih_consent_*` can't be server-erased; disclose in policy + email.

---

## 13. Out of scope (recommended follow-on)

- **Retention / auto-purge job.** None exists today (only `INVITE_TTL_DAYS`, no cron).
  DSAR and retention are usually specified together; a scheduled purge of stale
  candidate/interview data is the natural companion once the erase service exists — it can
  reuse the same cross-service erase path.
