# Direct Apply — Endpoint Spec

Detailed spec for the public candidate-application endpoints. All routes live in
`backend/app/routers/public.py` (mounted at `/api/public`). No auth. Every route is
`_rate_limit`-throttled like the rest of that router.

Two front doors, one code path:
- **Careers page** — `…/careers/{subdomain}/apply/{job_id}` → `source=career_page`.
- **Direct link / QR** — `…/apply/{job_id}` → `source=direct_link`.

Both resolve to a shared `_process_application(...)` so behavior is identical.

---

## 1. Routes

| Method | Path | Auth | Returns | Purpose |
|--------|------|------|---------|---------|
| GET  | `/api/public/careers/{subdomain}/apply/{job_id}` | none | HTML | Render the apply form (careers front door) |
| POST | `/api/public/careers/{subdomain}/apply/{job_id}` | none | HTML | Submit application (`source=career_page`) |
| GET  | `/api/public/apply/{job_id}` | none | HTML | Render the apply form (direct link / QR) |
| POST | `/api/public/apply/{job_id}` | none | HTML | Submit application (`source=direct_link`) |

Rate limits (per-IP, via `_rate_limit(request, limit, window)` from
`app/routers/invites.py`): **GET forms ~30/60s**, **POST submits ~10/60s**.

---

## 2. Request schema (POST — `multipart/form-data`)

The candidate types their own identity fields; the resume is used for storage +
text extraction only (no parsing needed for name/email — the form is authoritative).

| Field | Type | Required | Notes / validation |
|-------|------|----------|--------------------|
| `name` | `str` (Form) | yes | Trimmed; empty → falls back to `"Candidate"` |
| `email` | `EmailStr` (Form) | yes | Lower-cased + trimmed; invalid → **422** (Pydantic) |
| `phone` | `str` (Form) | no | Stored as-is |
| `consent` | `bool` (Form) | yes | Must be truthy → else **400** |
| `resume` | `UploadFile` (File) | no* | Allowlist `.pdf/.docx/.txt`; max 5 MB |

\* Resume optional at the API level; make it required in the form UI if you want to
force it. Extensions outside the allowlist → **400** (only those three are supported
by `extract_text_from_file`).

> **Note:** the Job's `screening_questions` column is the AI *interview* question
> set, **not** application-form questions — do **not** render it on this form.
> Per-job custom application questions need a new `Job` field and are v2 (§9).

---

## 3. Route bodies

```python
# backend/app/routers/public.py
import os, shutil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, Form, File, UploadFile
from fastapi.responses import HTMLResponse
from pydantic import EmailStr
from sqlalchemy import func

from app.models.applicant import Applicant, ApplicantSource, InterviewStatus
from app.models.job import Job, JobStatus
from app.models.organisation import Organisation
from app.utils.resume_parser import extract_text_from_file
from app.utils.uploads import ensure_upload_dir, safe_upload_path   # see §5

PRIVACY_POLICY_VERSION = "2026-07"   # move to settings if you version the policy


@router.get("/careers/{subdomain}/apply/{job_id}", response_class=HTMLResponse)
def career_apply_form(subdomain: str, job_id: UUID, request: Request, db: Session = Depends(get_db)):
    _rate_limit(request, limit=30, window=60.0)
    org, job = _resolve_org_job(db, job_id, subdomain=subdomain)
    return HTMLResponse(_apply_form_html(org, job, action=request.url.path))


@router.post("/careers/{subdomain}/apply/{job_id}", response_class=HTMLResponse)
def career_apply_submit(
    subdomain: str, job_id: UUID, request: Request,
    name: str = Form(...), email: EmailStr = Form(...), phone: Optional[str] = Form(None),
    consent: bool = Form(False), resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    _rate_limit(request, limit=10, window=60.0)
    org, job = _resolve_org_job(db, job_id, subdomain=subdomain)
    return _process_application(db, job, org, ApplicantSource.career_page, "career_page",
                                name, email, phone, consent, resume)


@router.get("/apply/{job_id}", response_class=HTMLResponse)
def direct_apply_form(job_id: UUID, request: Request, db: Session = Depends(get_db)):
    _rate_limit(request, limit=30, window=60.0)
    org, job = _resolve_org_job(db, job_id)
    return HTMLResponse(_apply_form_html(org, job, action=request.url.path))


@router.post("/apply/{job_id}", response_class=HTMLResponse)
def direct_apply_submit(
    job_id: UUID, request: Request,
    name: str = Form(...), email: EmailStr = Form(...), phone: Optional[str] = Form(None),
    consent: bool = Form(False), resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    _rate_limit(request, limit=10, window=60.0)
    org, job = _resolve_org_job(db, job_id)
    return _process_application(db, job, org, ApplicantSource.direct_link, "direct_link",
                                name, email, phone, consent, resume)
```

### Resolver — gate on "open for applications"

```python
def _resolve_org_job(db, job_id, subdomain: str | None = None):
    if subdomain is not None:
        org = db.query(Organisation).filter(Organisation.career_subdomain == subdomain).first()
        if not org:
            raise HTTPException(404, "Career page not found")
        org_id = org.id
    else:
        org = org_id = None
    q = db.query(Job).filter(
        Job.id == job_id,
        Job.is_job_listed == True,
        Job.status == JobStatus.published,
    )
    if org_id is not None:
        q = q.filter(Job.organisation_id == org_id)
    job = q.first()
    if not job:
        raise HTTPException(404, "This job is not open for applications.")
    if org is None:
        org = db.query(Organisation).filter(Organisation.id == job.organisation_id).first()
    return org, job
```

The `is_job_listed == True AND status == published` gate matches the existing
`GET /api/public/careers/{subdomain}` listing (`public.py:415`), so a job only accepts
applications while it's actually listed.

---

## 4. Core handler — `_process_application`

```python
def _process_application(db, job, org, source, entry_method,
                         name, email, phone, consent, resume):
    if not consent:
        raise HTTPException(400, "You must agree to the privacy policy to apply.")

    name = (name or "").strip()
    email = (email or "").strip().lower()

    resume_url, resume_text = _save_and_extract_resume(resume)   # None-safe, may raise 400

    # Dedupe by email within this job (mirror jobs.py:2024 existing-applicant branch).
    applicant = db.query(Applicant).filter(
        Applicant.job_id == job.id,
        func.lower(Applicant.email) == email,
    ).first()

    if applicant is None:
        applicant = Applicant(
            name=name or "Candidate", email=email, phone=phone,
            job_id=job.id, source=source, entry_method=entry_method,
        )
        db.add(applicant)
    else:
        # Returning applicant re-applies: refresh contact/resume, keep pipeline state.
        if name:  applicant.name = name
        if phone: applicant.phone = phone
        if not applicant.source:        applicant.source = source
        if not applicant.entry_method:  applicant.entry_method = entry_method

    if resume_url:  applicant.resume_url = resume_url
    if resume_text: applicant.resume_text = resume_text

    # Auto-enter pipeline: land in Recruiter Screening (pending), don't clobber
    # an already-advanced candidate re-applying.
    if not applicant.screening_status and not applicant.functional_status:
        applicant.screening_status = InterviewStatus.pending

    applicant.consent_given_at = datetime.utcnow()
    applicant.consent_version = PRIVACY_POLICY_VERSION

    db.commit()
    db.refresh(applicant)

    _broadcast_new_candidate(job, applicant)      # §6
    return HTMLResponse(_apply_success_html(org, job))
```

Stage routing note: `career_page`/`direct_link` are **not** handled by the existing
`source`-switch in `add_applicant` (`jobs.py:1872`, which only routes `scheduled` /
`functional` / `exit`). We set `screening_status = pending` explicitly here instead of
adding those sources to that switch, so the change stays local to the public router.
(To run resume screening first instead, set nothing and leave `resume_analysed=False`
so they land at the Resume Analysis stage — one-line swap.)

---

## 5. Resume handling

`_safe_upload_path` and `_ensure_upload_dir` currently live inside `jobs.py` (module
scope, `jobs.py:68` / near it). **Extract them to `app/utils/uploads.py`** (rename to
`safe_upload_path` / `ensure_upload_dir`) and import in both routers — cleaner than
importing across routers. This is a pure move (no route change → no `api.md` entry),
but re-point the `jobs.py` call sites.

```python
def _save_and_extract_resume(resume):
    if not resume or not resume.filename:
        return None, None
    ext = os.path.splitext(resume.filename)[1].lower()
    if ext not in (".pdf", ".docx", ".txt"):
        raise HTTPException(400, "Please upload a PDF, DOCX, or TXT file.")

    resume_dir = "uploads/resumes"
    ensure_upload_dir(resume_dir)
    path = safe_upload_path(resume_dir, resume.filename)   # None if unsafe filename
    if not path:
        return None, None

    # Stream to disk with a hard 5 MB cap (unauthenticated endpoint — bound the write).
    MAX = 5 * 1024 * 1024
    written = 0
    with open(path, "wb") as buf:
        while chunk := resume.file.read(1024 * 1024):
            written += len(chunk)
            if written > MAX:
                buf.close(); os.remove(path)
                raise HTTPException(400, "Resume too large (max 5 MB).")
            buf.write(chunk)

    text = extract_text_from_file(path)          # resume_parser.py:8, ≤12000 chars
    if text and len(text.strip()) < 50:
        text = None                              # scanned/garbled — don't store junk
    return path, text
```

We deliberately **skip `parse_resume_with_deepseek`** — the candidate supplies name /
email / phone on the form, so we only need `extract_text_from_file` for `resume_text`
(re-analysis survives an uploads/ wipe). `resume_url` stores the local path, exactly
like the bulk flow (`jobs.py:2074`).

---

## 6. WebSocket broadcast (copy of `jobs.py:1881`)

```python
def _broadcast_new_candidate(job, applicant):
    from app.websocket_manager import manager          # match jobs.py import
    from app.schemas import OutgoingMessage
    import asyncio
    msg = OutgoingMessage(
        type="candidate_update",
        content=f"New application: {applicant.name} applied for {job.role_name}",
        sender="System",
    ).model_dump_json()
    try:
        asyncio.get_running_loop().create_task(manager.broadcast(msg, room_id="global"))
    except RuntimeError:
        pass
```

Makes the applicant show up live in the recruiter pipeline.

---

## 7. Schema / model / migration

New consent columns on `Applicant` (`backend/app/models/applicant.py`):

```python
consent_given_at = Column(DateTime(timezone=True), nullable=True)
consent_version  = Column(String, nullable=True)
```

Matching idempotent migrations in `backend/main.py:init_db()` (mandatory per CLAUDE.md):

```python
conn.execute(text("ALTER TABLE applicants ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMP;"))
conn.execute(text("ALTER TABLE applicants ADD COLUMN IF NOT EXISTS consent_version VARCHAR;"))
```

No new request Pydantic model needed (fields come via `Form`/`File`). Only add these
to `ApplicantOut` if you want consent surfaced in the recruiter API; otherwise leave
response schemas untouched.

---

## 8. Responses & error codes

Success → **200 `text/html`**: a confirmation page ("Application received for
{role} at {org}"), reusing the dark inline style from `confirm_interview_slot`
(`public.py:260`).

| Status | When |
|--------|------|
| 200 | Form rendered / application accepted |
| 400 | Consent not given · unsupported file type · resume > 5 MB |
| 404 | Unknown `subdomain` · job not found / not listed / not published |
| 422 | Missing `name`/`email` or invalid `email` (FastAPI/Pydantic) |
| 429 | Rate limit exceeded (`_rate_limit`) |

HTML builders to add: `_apply_form_html(org, job, action)` (the `<form method="post"
enctype="multipart/form-data">` with name/email/phone/resume + a required consent
checkbox linking the privacy policy) and `_apply_success_html(org, job)`.

---

## 9. Security / abuse (unauthenticated PII intake)

- **Rate-limited** on every route (§1). Consider tightening POST to ~5/60s.
- **File allowlist + 5 MB stream cap** (§5) bound the upload surface.
- **Dedupe by email** stops trivial duplicate spam; a determined attacker can still
  submit distinct emails → v2: double opt-in email verification or a CAPTCHA on POST.
- **Data controller:** we now hold candidate PII first-hand. `consent_given_at` +
  `consent_version` record the grant; the existing `/api/privacy` router already
  services their access/erasure requests. Wire the consent checkbox to the live
  privacy-policy URL.
- Filename sanitized via `safe_upload_path` (zip-slip / traversal defense already in it).

---

## 10. `api.md` entry (draft — prepend, newest first)

> **2026-07-17** — Added public candidate self-apply endpoints (`backend/app/routers/public.py`,
> prefix `/api/public`): **GET/POST `/api/public/careers/{subdomain}/apply/{job_id}`**
> (`source=career_page`) and **GET/POST `/api/public/apply/{job_id}`** (`source=direct_link`).
> GET returns the apply form (HTML); POST accepts `multipart/form-data`
> `{name:str, email:EmailStr, phone?:str, consent:bool, resume?:file(.pdf/.docx/.txt, ≤5MB)}`
> and creates/updates an `Applicant` (dedupe by email within the job), extracts
> `resume_text`, sets `screening_status=pending` (auto-enter pipeline), records
> `consent_given_at`/`consent_version`, broadcasts `candidate_update`, and returns an
> HTML confirmation. Job must be `is_job_listed && published` (else 404). Errors: 400
> (no consent / bad file type / >5MB), 404 (unknown subdomain/job), 422 (missing/invalid
> field), 429 (rate-limited; GET ~30/60s, POST ~10/60s). New nullable `applicants`
> columns `consent_given_at` (TIMESTAMP) + `consent_version` (VARCHAR) via `init_db()`.
> Also extracted `safe_upload_path`/`ensure_upload_dir` to `app/utils/uploads.py`
> (no route change). `GET /api/public/careers/{subdomain}` unchanged.

---

## 11. Test checklist

- `python -c "import main"` — imports/routes load (CLAUDE.md backend check).
- `GET .../careers/{sub}/apply/{job_id}` for a listed job → 200 form; for an unlisted
  job or bad subdomain → 404.
- `POST` with a valid `.pdf` + `consent=true` → 200; a new `Applicant` exists with
  `source=career_page`, `screening_status=pending`, non-null `resume_text`,
  `consent_given_at` set.
- Same email re-applies → no duplicate row; contact/resume refreshed.
- `consent=false` → 400. `.exe` upload → 400. 6 MB file → 400. Bad email → 422.
- 11th POST within 60s from one IP → 429.
- Recruiter pipeline updates live (WebSocket `candidate_update`).
- `GET /api/public/apply/{job_id}` direct path works and tags `source=direct_link`.
