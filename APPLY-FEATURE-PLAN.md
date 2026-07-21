# Direct Apply — Implementation Plan

Candidates apply directly to IntervieHire instead of the company collecting
details and forwarding them. The candidate fills a form on a page **we** host;
the application lands straight in our DB as an `Applicant`; the recruiter just
sees it appear in their pipeline. No middleman.

## Decisions (locked)

- **Apply page is backend-hosted** — FastAPI serves the form as HTML, exactly
  like the existing `confirm`/`oauth` pages in `backend/app/routers/public.py`.
  No new frontend deploy.
- **Applicants auto-enter the pipeline** — on submit the applicant is created and
  routed straight to a stage (screening pending), visible to the recruiter
  immediately. No manual approval gate.

## How it works (data flow)

```
Candidate  →  GET  /api/public/careers/{subdomain}          (list jobs — EXISTS)
           →  GET  /api/public/careers/{subdomain}/apply/{job_id}   (form — NEW)
           →  POST /api/public/careers/{subdomain}/apply/{job_id}   (submit — NEW)
                     │  create Applicant(source=career_page, entry_method="career_page")
                     │  parse resume → resume_text / resume_url
                     │  screening_status = pending   (auto-enter pipeline)
                     │  record consent
                     ▼
Recruiter dashboard pipeline  ←  applicant appears (WebSocket "candidate_update")
```

One shareable link per job (and a QR) is the same thing keyed by job id for the
direct-link / job-board / LinkedIn front door.

## What already exists (reuse, don't rebuild)

- `Organisation.career_subdomain` — auto-provisioned per org at signup
  (`auth.py:238`) and on org save (`organisation.py`). Slug logic in
  `app/utils/career.py`.
- `GET /api/public/careers/{subdomain}` (`public.py:410`) — lists an org's
  `is_job_listed && published` jobs. This is the read side; we add the apply side.
- `ApplicantSource.career_page` and `direct_link` already in the enum
  (`models/applicant.py:25`).
- Stage routing pattern (`jobs.py:1872`): `source == scheduled` → `screening_status =
  pending`; `functional`/`exit` → `functional_status = pending`. **Note:**
  `career_page` is NOT currently routed to a stage — we add that.
- Resume parsing — `backend/app/utils/resume_parser.py` (used by the
  `upload-resumes` flow at `jobs.py:2068`). Reuse it to fill `resume_text`.
- Per-IP rate limiting — `_rate_limit(request, limit, window)` from
  `app/routers/invites.py`, already used on every public route in `public.py`.
- WebSocket broadcast — `manager.broadcast(..., room_id="global")` fires a
  `candidate_update` so the pipeline updates live (`jobs.py:1881`).

## What to build

### A. Backend — public apply endpoints (`backend/app/routers/public.py`)

1. `GET /api/public/careers/{subdomain}/apply/{job_id}` → returns the apply form as
   HTML (reuse the dark inline style from `confirm_interview_slot`). Fields: name,
   email, phone, resume file upload, plus the job's screening questions if any, and
   a required consent checkbox linking the privacy policy. 404 if the subdomain or
   job doesn't resolve to a listed/published job. Rate-limit ~30/60s.

2. `POST /api/public/careers/{subdomain}/apply/{job_id}` → accepts `multipart/form-data`
   (resume file + fields). Steps:
   - Resolve org by `career_subdomain`; resolve `Job` (must be `is_job_listed` +
     `published`); 404 otherwise.
   - Reject if consent not given (400).
   - Optional dedupe: if an applicant with this email already exists for the job,
     update rather than duplicate (mirror the existing-applicant branch at
     `jobs.py:2037`).
   - Save + parse the resume via `resume_parser` → `resume_url`, `resume_text`.
   - Create `Applicant(name, email, phone, job_id, source=ApplicantSource.career_page,
     entry_method="career_page", resume_url, resume_text)` and set
     `screening_status = InterviewStatus.pending` (auto-enter pipeline).
   - Record consent (see D) and `db.commit()`.
   - Broadcast `candidate_update` (copy the block from `add_applicant`).
   - Return an HTML "Application received" confirmation page.
   - Rate-limit ~10/60s.

3. Direct-link / QR front door — add the same POST keyed by job id only:
   `GET|POST /api/public/apply/{job_id}` with `source=direct_link`,
   `entry_method="direct_link"`. Identical body; lets a job be shared without the
   careers subdomain (LinkedIn, email, QR). Resolve the org via `job.organisation_id`.

### B. Backend — schema / model / migration

- No new request Pydantic model strictly required (multipart is read field-by-field),
  but add a `CareerApplyIn` if you prefer typed validation of the non-file fields.
- **Consent storage** — add `consent_given_at` (nullable `DateTime`) and
  `consent_version` (nullable `String`) to the `Applicant` model
  (`models/applicant.py`), and matching lines in `main.py:init_db()`:
  ```
  ALTER TABLE applicants ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMP;
  ALTER TABLE applicants ADD COLUMN IF NOT EXISTS consent_version VARCHAR;
  ```
  (Per CLAUDE.md: any new column needs a matching `ADD COLUMN IF NOT EXISTS`.)
- If you expose consent in `ApplicantOut`, add the fields there too; otherwise leave
  the response schema unchanged.

### C. Dashboard — surface the links (`dashboard/src/dashboard/`)

In the job detail pane, add a "Share / Apply link" section that shows:
- the careers apply URL and the direct-link URL for the job,
- a copy button, a QR image, and a small copy-paste embed snippet (an "Apply" button/
  iframe pointing at the hosted page) for clients who want it on their own site.

Follow the vanilla-JS convention (CLAUDE.md): a `buildApplyLinkPanel()` returning an
HTML string **and** a paired `bindApplyLinkPanel()` that is actually called after
`innerHTML` is set (see `job-detail-panes.js` `buildAddApplicantsPanel` /
`bindAddApplicantsPanel` as the reference). Escape all interpolated content with
`escapeHTML()`.

### D. `api.md` — sync in the same unit of work (MANDATORY)

Per CLAUDE.md, spin up the dedicated `api.md` sub-agent to:
- Prepend a changelog entry (date, routes touched, what changed).
- Add full request/response schemas for the new `GET`/`POST` apply routes (path +
  query params, multipart body fields, success HTML/JSON, error codes: 400 no
  consent, 404 unknown subdomain/job, 429 rate-limited).

## Suggested build order (parallelizable)

Per CLAUDE.md's "decompose + parallelize" rule, dispatch these as parallel units:

1. **Backend endpoints + migration** (A + B) — the core; everything else points at it.
2. **Apply-form HTML** — can be built alongside A (same file, coordinate the merge).
3. **Dashboard share panel** (C) — independent; only needs the final URL shape.
4. **`api.md` sub-agent** (D) — runs in parallel, finalized once A's schemas settle.

## Verify before "done"

- Backend import/route check: `python -c "import main"` (CLAUDE.md).
- Hit `GET .../apply/{job_id}` → form renders; `POST` with a test resume → 200 and a
  new `Applicant` row with `source=career_page`, `screening_status=pending`.
- Confirm it shows in the recruiter pipeline (WebSocket `candidate_update` fires).
- Rate-limit returns 429 past the window; missing consent returns 400.
- `api.md` matches the shipped schemas verbatim.

## Notes / v2

- Because candidates now hand us PII directly, IntervieHire is the data controller at
  this step. The consent checkbox + `consent_given_at` covers the minimum; the
  existing `/api/privacy` router already handles their later data-rights requests.
- v2 doorways (same backend): a proper careers frontend page that renders the
  `careers/{subdomain}` JSON, and the embeddable widget for client sites.
- Alternative routing: if you'd rather run resume screening first, drop applicants at
  the Resume Analysis stage (`resume_analysed=False`, like the bulk-upload flow at
  `jobs.py:2068`) instead of `screening_status=pending` — a one-line change.
