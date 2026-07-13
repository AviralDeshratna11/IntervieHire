"""Cross-service data-rights engine for the DPDP Act 2023 self-serve flow.

Given a Data Principal (candidate) identified by email (+ optional org scope), this module
ANONYMISES them in place (decision D4): every store is scrubbed of PII / free-text / media,
but a non-identifying skeleton — ids, job link, numeric scores, status, dates — is kept.

Because the backend and the interview engine share ONE Postgres, the backend performs all
DB work directly via the engine mirror models (``app.models.ai_integration``): deleting a
``Candidate`` cascades at the DB level (real Prisma FKs, no ``relationMode``) to its
``InterviewSession`` -> ``TranscriptEvent`` / ``InterviewTranscript`` / ``ProctoringLog``.
``ConsentLog`` has no FK and is anonymised explicitly (kept as proof, identifiers stripped).

The ONLY thing the backend cannot reach is the engine's on-disk transcript ``.txt`` and
recording files (separate container), so it calls the engine's files-only internal endpoint
``POST /internal/data-rights/erase-files`` for those.

Scope (decision D3): ``company`` restricts to one organisation; ``platform`` covers every
org that holds the email. The exact backend Applicant <-> engine Candidate link is
``Applicant.id == InterviewSession.id`` (see ai_sync), which we use to resolve engine rows
precisely without needing the org->company id mapping.

Nothing here runs until the ``/api/privacy`` router (Phase C) invokes it. Best-effort at
each step, resumable: the engine file unlink runs BEFORE any row delete, so a mid-way
failure never loses data that a retry can't re-resolve.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
import os

import requests
from sqlalchemy.orm import Session

from app.config import settings
from app.models.applicant import Applicant
from app.models.job import Job
from app.models.interview_report import InterviewReport
from app.models.interview_invite import InterviewInvite
from app.models.ai_integration import Candidate, InterviewSession, ConsentLog
from app.models.data_subject_request import DataSubjectRequest, DSARStatus, DSARScope
from app.models.compliance_audit_log import AuditActorType
from app.utils.audit import record_audit

# Placeholder written into NOT-NULL identity columns we cannot simply null out.
REDACTED = "[erased]"


def _anonymised_email(row_id) -> str:
    """A unique, non-routable stand-in for a scrubbed email — keeps NOT-NULL + any
    uniqueness constraints satisfied while carrying no personal data."""
    return f"erased+{row_id}@erased.invalid"


# --------------------------------------------------------------------------- resolve

def resolve_targets(db: Session, email: str, organisation_id, scope: DSARScope) -> dict:
    """Find every in-scope store row for this Data Principal (read-only).

    Returns applicants, their resume file paths, and the engine session/candidate ids
    reached via the exact ``Applicant.id == InterviewSession.id`` link.
    """
    q = db.query(Applicant).join(Job, Applicant.job_id == Job.id).filter(Applicant.email == email)
    if scope == DSARScope.company and organisation_id is not None:
        q = q.filter(Job.organisation_id == organisation_id)
    applicants = q.all()

    applicant_ids = [str(a.id) for a in applicants]
    resume_paths = [a.resume_url for a in applicants if a.resume_url]

    # Engine sessions share the applicant's id; candidates are their owners.
    sessions = (
        db.query(InterviewSession).filter(InterviewSession.id.in_(applicant_ids)).all()
        if applicant_ids else []
    )
    session_ids = [s.id for s in sessions]
    candidate_ids = sorted({s.candidateId for s in sessions if s.candidateId})
    org_ids = sorted({str(a.job.organisation_id) for a in applicants if a.job and a.job.organisation_id})

    return {
        "applicants": applicants,
        "applicant_ids": applicant_ids,
        "resume_paths": resume_paths,
        "session_ids": session_ids,
        "candidate_ids": candidate_ids,
        "org_ids": org_ids,
    }


# ----------------------------------------------------------------- backend scrubbing

def _scrub_applicant(applicant: Applicant, request_id) -> None:
    """Reduce an applicant row to a non-identifying analytic stub."""
    applicant.name = REDACTED
    applicant.email = _anonymised_email(applicant.id)
    applicant.phone = None
    applicant.resume_url = None
    applicant.remarks = None
    applicant.resume_analysis_report = None
    applicant.resume_text = None
    applicant.recruiter_screening = None
    applicant.scheduling_token = None
    applicant.calendar_event_id = None
    applicant.manager_name = None  # exit-interview leaver PII; department/reason kept (non-identifying)
    applicant.anonymised_at = datetime.now(timezone.utc)
    applicant.erasure_request_id = request_id
    # KEPT (non-identifying): job_id, all *_score / *_status, decision, source,
    # department, tenure_months, separation_type, primary_reason, timestamps.


def _scrub_report(db: Session, applicant_id) -> int:
    """Strip free-text / media from the applicant's interview report; keep numeric scores."""
    n = 0
    for rep in db.query(InterviewReport).filter(InterviewReport.applicant_id == applicant_id).all():
        rep.summary = None
        rep.transcript = None
        rep.video_url = None
        n += 1  # detailed_scores (numeric) retained
    return n


def _delete_invites(db: Session, applicant_ids, email: str) -> int:
    """Remove interview invites (they carry candidate_email/name, and their FK to
    applicants has no cascade — so they must go before/with the applicant row)."""
    q = db.query(InterviewInvite).filter(
        (InterviewInvite.applicant_id.in_(applicant_ids)) | (InterviewInvite.candidate_email == email)
    )
    rows = q.all()
    for inv in rows:
        db.delete(inv)
    return len(rows)


# ------------------------------------------------------------------ engine scrubbing

def _anonymise_consent_logs(db: Session, session_ids, email: str, request_id) -> int:
    """Keep the consent proof (action/version/scopes/timestamp) but strip identifiers.

    ConsentLog deliberately outlives interview-data deletion, so we anonymise rather than
    delete it — DPDP §8 / §17-style retention of a compliance record with no residual PII.
    """
    q = db.query(ConsentLog).filter(
        (ConsentLog.sessionId.in_(session_ids)) | (ConsentLog.candidateEmail == email)
    )
    rows = q.all()
    for c in rows:
        c.candidateEmail = None
        c.candidateName = None
        c.ipAddress = None
        c.userAgent = None
        c.inviteToken = None
        c.erasedForRequestId = str(request_id) if request_id else None
    return len(rows)


def _delete_candidates(db: Session, candidate_ids) -> int:
    """Delete engine Candidate rows. DB-level cascade removes their InterviewSession rows
    and, transitively, TranscriptEvent / InterviewTranscript / ProctoringLog — including
    the verbatim transcript + evaluation JSON. Numeric scores survive on the backend stub."""
    n = 0
    for cand in db.query(Candidate).filter(Candidate.id.in_(candidate_ids)).all():
        db.delete(cand)
        n += 1
    return n


# ------------------------------------------------------------------- engine files RPC

def _erase_engine_files(session_ids, request_id) -> dict:
    """Ask the engine to unlink its on-disk transcript .txt + recording files for these
    sessions. Runs BEFORE row deletion so the engine can still read each session's
    transcript JSON to locate recordings. Best-effort — raises on transport error so the
    caller can leave the request ``in_progress`` and retry."""
    if not session_ids:
        return {"filesUnlinked": [], "count": 0, "skipped": "no-sessions"}
    resp = requests.post(
        f"{settings.ENGINE_API_URL.rstrip('/')}/internal/data-rights/erase-files",
        json={"sessionIds": session_ids, "requestId": str(request_id)},
        headers={"x-internal-secret": settings.INTERNAL_SERVICE_SECRET},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------- orchestrator

def erase_subject(
    db: Session,
    request: DataSubjectRequest,
    *,
    actor_type: AuditActorType = AuditActorType.candidate,
    actor_id: Optional[str] = None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> dict:
    """Anonymise a Data Principal across every store for a verified erasure request.

    Ordering (resumable): resolve -> engine files unlink -> backend rows -> engine rows ->
    commit -> audit. On any failure the transaction is rolled back and the request is left
    ``in_progress`` with an audit trail, safe to retry.
    """
    email = request.subject_email
    targets = resolve_targets(db, email, request.organisation_id, request.scope)

    manifest = {
        "scope": request.scope.value,
        "org_ids": targets["org_ids"],
        "applicants": len(targets["applicants"]),
        "sessions": len(targets["session_ids"]),
        "candidates": len(targets["candidate_ids"]),
    }

    try:
        # 1) Engine on-disk files first (needs sessions to still exist to find recordings).
        files_result = _erase_engine_files(targets["session_ids"], request.id)
        manifest["engine_files_unlinked"] = files_result.get("count", 0)

        # 2) Backend rows: invites -> report scrub -> applicant scrub.
        manifest["invites_deleted"] = _delete_invites(db, targets["applicant_ids"], email)
        reports = 0
        for a in targets["applicants"]:
            reports += _scrub_report(db, a.id)
            _scrub_applicant(a, request.id)
        manifest["reports_scrubbed"] = reports

        # 3) Backend on-disk resume files.
        removed = 0
        for path in targets["resume_paths"]:
            try:
                if path and os.path.exists(path):
                    os.remove(path)
                    removed += 1
            except OSError:
                pass  # ephemeral FS: file may already be gone
        manifest["resume_files_removed"] = removed

        # 4) Engine rows: anonymise consent (kept), delete candidates (cascades sessions).
        manifest["consent_logs_anonymised"] = _anonymise_consent_logs(
            db, targets["session_ids"], email, request.id
        )
        manifest["candidates_deleted"] = _delete_candidates(db, targets["candidate_ids"])

        # 5) Finalise the request.
        request.status = DSARStatus.fulfilled
        request.fulfilled_at = datetime.now(timezone.utc)
        request.payload = {**(request.payload or {}), "erasure_manifest": manifest}

        db.commit()
    except Exception as exc:
        db.rollback()
        request.status = DSARStatus.in_progress
        request.payload = {**(request.payload or {}), "erasure_error": str(exc)}
        db.commit()
        record_audit(
            db, action="dsar.erasure.failed", actor_type=actor_type, actor_id=actor_id,
            organisation_id=request.organisation_id, entity_type="data_subject_request",
            entity_id=request.id, subject_email=email,
            detail={**manifest, "error": str(exc)}, request_ip=request_ip, user_agent=user_agent,
        )
        raise

    record_audit(
        db, action="dsar.erasure.fulfilled", actor_type=actor_type, actor_id=actor_id,
        organisation_id=request.organisation_id, entity_type="data_subject_request",
        entity_id=request.id, subject_email=email, detail=manifest,
        request_ip=request_ip, user_agent=user_agent,
    )
    return manifest


def _erase_engine_files_safe(session_ids, request_id) -> dict:
    """Best-effort engine file unlink for the single-applicant path — a down engine must
    not block a recruiter's action (the full DSAR flow uses the raising variant)."""
    try:
        return _erase_engine_files(session_ids, request_id)
    except Exception:
        return {"filesUnlinked": [], "count": 0, "error": "engine-unreachable"}


def anonymise_applicant(
    db: Session,
    applicant: Applicant,
    *,
    actor_type: AuditActorType = AuditActorType.recruiter,
    actor_id: Optional[str] = None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> dict:
    """Anonymise a SINGLE applicant in place — the recruiter 'delete' path (decision: route
    through DSAR anonymise). Same mechanics as a full-subject erasure but scoped to one
    application: the person's OTHER applications, and the shared engine ``Candidate`` (if it
    still owns sessions), are left intact. Leaves a non-identifying scores/status stub.
    """
    session_id = str(applicant.id)
    email = applicant.email
    org_id = applicant.job.organisation_id if applicant.job else None
    resume_path = applicant.resume_url  # capture before the scrub nulls it
    manifest = {"applicant_id": session_id, "session_id": session_id}

    # 1) Engine on-disk files first (best-effort).
    manifest["engine_files_unlinked"] = _erase_engine_files_safe([session_id], None).get("count", 0)

    # 2) Backend rows: this applicant's own invites, report free-text, and the stub.
    invites = db.query(InterviewInvite).filter(InterviewInvite.applicant_id == applicant.id).all()
    for inv in invites:
        db.delete(inv)
    manifest["invites_deleted"] = len(invites)
    manifest["reports_scrubbed"] = _scrub_report(db, applicant.id)
    _scrub_applicant(applicant, None)

    # 3) Backend on-disk resume file.
    if resume_path:
        try:
            if os.path.exists(resume_path):
                os.remove(resume_path)
                manifest["resume_file_removed"] = True
        except OSError:
            pass

    # 4) Engine rows: anonymise this session's consent, delete just this session (cascades
    #    its transcript/events/proctoring). Delete the shared Candidate only if now empty.
    manifest["consent_logs_anonymised"] = _anonymise_consent_logs(db, [session_id], email, None)
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    candidate_id = session.candidateId if session else None
    if session:
        db.delete(session)
        manifest["session_deleted"] = True
    if candidate_id:
        db.flush()
        remaining = db.query(InterviewSession).filter(InterviewSession.candidateId == candidate_id).count()
        if remaining == 0:
            cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
            if cand:
                db.delete(cand)
                manifest["candidate_deleted"] = True

    db.commit()
    record_audit(
        db, action="applicant.anonymised", actor_type=actor_type, actor_id=actor_id,
        organisation_id=org_id, entity_type="applicant", entity_id=session_id,
        subject_email=email, detail=manifest, request_ip=request_ip, user_agent=user_agent,
    )
    return manifest


# ---------------------------------------------------------------------- rectification

RECTIFIABLE_FIELDS = ("name", "phone", "email")


def rectify_subject(
    db: Session,
    email: str,
    organisation_id,
    scope: DSARScope,
    changes: dict,
    *,
    actor_type: AuditActorType = AuditActorType.candidate,
    actor_id: Optional[str] = None,
    request_id=None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> dict:
    """Apply a Data Principal's own corrections (decision D5: candidate self-edit, incl.
    email). ``changes`` may carry ``name`` / ``phone`` / ``email``. An email change re-keys
    the soft join, so it's propagated across every store in one transaction: backend
    ``applicants`` + ``interview_invites`` and the engine ``Candidate``. The audit records
    WHICH fields changed, never the values (the audit log is retained)."""
    changes = {k: v for k, v in (changes or {}).items() if k in RECTIFIABLE_FIELDS}
    if not changes:
        return {"fields": [], "note": "no rectifiable fields supplied"}

    targets = resolve_targets(db, email, organisation_id, scope)
    manifest = {"fields": sorted(changes.keys())}

    for a in targets["applicants"]:
        if "name" in changes:
            a.name = changes["name"]
        if "phone" in changes:
            a.phone = changes["phone"]
        if "email" in changes:
            a.email = changes["email"]
    manifest["applicants"] = len(targets["applicants"])

    if "email" in changes:
        invites = db.query(InterviewInvite).filter(
            (InterviewInvite.applicant_id.in_(targets["applicant_ids"]))
            | (InterviewInvite.candidate_email == email)
        ).all()
        for inv in invites:
            inv.candidate_email = changes["email"]
        manifest["invites_rekeyed"] = len(invites)

    candidates = (
        db.query(Candidate).filter(Candidate.id.in_(targets["candidate_ids"])).all()
        if targets["candidate_ids"] else []
    )
    collisions = 0
    for cand in candidates:
        if "name" in changes:
            cand.fullName = changes["name"]
        if "phone" in changes:
            cand.phone = changes["phone"]
        if "email" in changes:
            # @@unique([companyId, email]) — skip if another Candidate already holds it.
            clash = db.query(Candidate).filter(
                Candidate.companyId == cand.companyId,
                Candidate.email == changes["email"],
                Candidate.id != cand.id,
            ).first()
            if clash:
                collisions += 1
                continue
            cand.email = changes["email"]
    manifest["candidates"] = len(candidates)
    if collisions:
        manifest["email_collisions_skipped"] = collisions

    db.commit()
    record_audit(
        db, action="applicant.rectified", actor_type=actor_type, actor_id=actor_id,
        organisation_id=organisation_id, entity_type="data_subject_request" if request_id else "applicant",
        entity_id=request_id, subject_email=email, detail=manifest,
        request_ip=request_ip, user_agent=user_agent,
    )
    return manifest
