"""Consolidated per-subject data export — DPDP Act 2023 §11 (right to access) + portability.

Gathers everything a Data Principal's records hold across the shared DB plus their resume
file into one downloadable package: a ``manifest.json`` (provenance + §11 processor
disclosure), a ``data.json`` grouped by store, a human-readable ``summary.md``, and the
resume file(s) under ``files/``.

Read-only. The tokenized, single-use download endpoint that actually serves this ZIP lives
in the ``/api/privacy`` router (Phase C); this module only builds the bytes.

Scope mirrors erasure (decision D3): ``company`` = one Data Fiduciary, ``platform`` = every
org holding the email. Engine-side granular ``TranscriptEvent`` rows and the on-disk
transcript ``.txt`` are not mirrored in the backend ORM; the session's ``transcript`` JSON
(which carries the dialogue) and ``evaluation`` are included, and a future engine export
endpoint can add the granular events if needed.
"""
from __future__ import annotations

import io
import json
import os
import zipfile
from datetime import datetime, timezone

from sqlalchemy import inspect as sa_inspect
from sqlalchemy.orm import Session

from app.config import settings
from app.models.interview_report import InterviewReport
from app.models.ai_integration import Candidate, InterviewSession, ProctoringLog, ConsentLog
from app.models.data_subject_request import DSARScope
from app.utils.data_rights import resolve_targets

# Sub-processors the data is shared with — DPDP §11(b)/(c) disclosure.
SUB_PROCESSORS = [
    "IntervieHire interview engine (interview delivery, transcript, evaluation)",
    "DeepSeek (AI answer scoring) — only when configured; zero-key path uses a deterministic evaluator",
]


def _row_to_dict(obj) -> dict:
    """Dump every mapped column of a SQLAlchemy row (the subject's own data)."""
    return {c.key: getattr(obj, c.key) for c in sa_inspect(obj).mapper.column_attrs}


def build_export_package(db: Session, email: str, organisation_id, scope: DSARScope) -> dict:
    """Assemble the subject's full data package (structured data + resume file bytes)."""
    targets = resolve_targets(db, email, organisation_id, scope)
    applicants = targets["applicants"]
    applicant_ids = targets["applicant_ids"]
    session_ids = targets["session_ids"]
    candidate_ids = targets["candidate_ids"]

    reports = (
        db.query(InterviewReport).filter(InterviewReport.applicant_id.in_([a.id for a in applicants])).all()
        if applicants else []
    )
    candidates = (
        db.query(Candidate).filter(Candidate.id.in_(candidate_ids)).all() if candidate_ids else []
    )
    sessions = (
        db.query(InterviewSession).filter(InterviewSession.id.in_(session_ids)).all() if session_ids else []
    )
    proctoring = (
        db.query(ProctoringLog).filter(ProctoringLog.sessionId.in_(session_ids)).all() if session_ids else []
    )
    consent = (
        db.query(ConsentLog).filter(
            (ConsentLog.sessionId.in_(session_ids)) | (ConsentLog.candidateEmail == email)
        ).all()
        if session_ids else db.query(ConsentLog).filter(ConsentLog.candidateEmail == email).all()
    )

    data = {
        "subject_email": email,
        "scope": scope.value,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "controller_org_ids": targets["org_ids"],
        "processors_data_shared_with": SUB_PROCESSORS,
        "applications": [_row_to_dict(a) for a in applicants],
        "interview_reports": [_row_to_dict(r) for r in reports],
        "candidate_records": [_row_to_dict(c) for c in candidates],
        "interview_sessions": [_row_to_dict(s) for s in sessions],
        "proctoring_logs": [_row_to_dict(p) for p in proctoring],
        "consent_history": [_row_to_dict(c) for c in consent],
    }

    # Resume file(s) on disk.
    files = []
    for a in applicants:
        path = a.resume_url
        if path and os.path.exists(path):
            try:
                with open(path, "rb") as fh:
                    files.append((os.path.basename(path), fh.read()))
            except OSError:
                pass

    manifest = {
        "generated_at": data["generated_at"],
        "subject_email": email,
        "scope": scope.value,
        "controller_org_ids": targets["org_ids"],
        "counts": {
            "applications": len(applicants),
            "interview_reports": len(reports),
            "candidate_records": len(candidates),
            "interview_sessions": len(sessions),
            "proctoring_logs": len(proctoring),
            "consent_records": len(consent),
            "files": len(files),
        },
        "contact_for_grievance": settings.DPO_CONTACT_EMAIL,
    }

    summary = _build_summary(manifest)
    return {"manifest": manifest, "data": data, "files": files, "summary": summary}


def _build_summary(manifest: dict) -> str:
    c = manifest["counts"]
    return (
        "# Your data — export summary\n\n"
        f"Generated: {manifest['generated_at']}\n\n"
        "This package contains the personal data IntervieHire holds about you, gathered under "
        "your right of access (DPDP Act 2023, §11).\n\n"
        "## What's included\n"
        f"- Applications: {c['applications']}\n"
        f"- Interview reports: {c['interview_reports']}\n"
        f"- Candidate records: {c['candidate_records']}\n"
        f"- Interview sessions (transcript + evaluation): {c['interview_sessions']}\n"
        f"- Proctoring logs: {c['proctoring_logs']}\n"
        f"- Consent records: {c['consent_records']}\n"
        f"- Files (resumes): {c['files']}\n\n"
        "## Shared with (processors/sub-processors)\n"
        + "".join(f"- {p}\n" for p in SUB_PROCESSORS)
        + "\n`data.json` holds the full structured data; `files/` holds your uploaded documents.\n\n"
        f"Questions or a grievance? Contact: {manifest['contact_for_grievance']}\n"
    )


def zip_export_package(package: dict) -> bytes:
    """Serialise a package from ``build_export_package`` into ZIP bytes."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("manifest.json", json.dumps(package["manifest"], default=str, indent=2))
        z.writestr("data.json", json.dumps(package["data"], default=str, indent=2))
        z.writestr("summary.md", package["summary"])
        for name, content in package["files"]:
            z.writestr(f"files/{name}", content)
    return buf.getvalue()
