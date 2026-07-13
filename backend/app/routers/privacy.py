"""Candidate self-serve data-rights API (DPDP Act 2023).

Public, unauthenticated intake -> emailed one-time-token verification -> fulfilment:
- access/export  -> a downloadable ZIP of everything we hold (DPDP §11)
- rectification  -> the candidate's own corrections (self-edit, incl. email)
- erasure        -> anonymise-in-place across every store, behind a DOUBLE confirm

Plus a grievance channel (DPDP §13) and recruiter/admin visibility. Identity = possession
of the emailed inbox (proven via a single-use, time-boxed token whose hash only is stored).
Every route is rate-limited; every fulfilment is audited.

The heavy lifting lives in the runtime-verified services app.utils.data_rights /
app.utils.data_export — this router is intake, verification, dispatch, and delivery only.
"""
from datetime import datetime, timezone, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.utils.auth import get_current_user, get_active_org_id
from app.routers.invites import _rate_limit
from app.utils.audit import record_audit
from app.utils.email_sender import send_html_email
from app.utils.privacy_tokens import generate_token, hash_token, verify_token, expiry_from_now
from app.utils import data_rights, data_export
from app.models.user import User
from app.models.interview_invite import InterviewInvite
from app.models.job import Job
from app.models.compliance_audit_log import AuditActorType, ComplianceAuditLog
from app.models.data_subject_request import (
    DataSubjectRequest, DSARType, DSARStatus, DSARScope,
)

router = APIRouter()


# --------------------------------------------------------------------------- helpers

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _client_ip(request: Request) -> Optional[str]:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else None


def _ua(request: Request) -> Optional[str]:
    ua = request.headers.get("user-agent")
    return ua[:400] if ua else None


def _page(title: str, body: str, status_code: int = 200) -> HTMLResponse:
    html = f"""<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><style>
body{{font-family:'Segoe UI',system-ui,sans-serif;background:#f4f4f6;color:#17171F;margin:0;padding:48px 16px;}}
.card{{max-width:560px;margin:0 auto;background:#fff;border:1px solid #ECECF1;border-radius:18px;padding:40px;box-shadow:0 8px 30px rgba(23,23,31,.06);}}
h1{{font-size:22px;margin:0 0 16px;}} p{{line-height:1.6;color:#3A3A45;}}
a.btn,button.btn{{display:inline-block;background:#F5542E;color:#fff;border:0;text-decoration:none;font:600 15px/1 'Segoe UI',sans-serif;padding:14px 28px;border-radius:10px;cursor:pointer;margin-top:12px;}}
.muted{{font-size:13px;color:#6B6B76;}}</style></head>
<body><div class="card"><h1>{title}</h1>{body}
<p class="muted">Questions or a grievance? Contact {settings.DPO_CONTACT_EMAIL}.</p></div></body></html>"""
    return HTMLResponse(html, status_code=status_code)


def _link(path: str) -> str:
    return f"{settings.INVITE_LINK_BASE.rstrip('/')}{path}"


# ------------------------------------------------------------------ request schemas

class CreateRequestIn(BaseModel):
    email: str
    request_type: str                 # access_export | erasure | rectification
    scope: str = "company"            # company | platform
    organisation_id: Optional[UUID] = None
    invite_token: Optional[str] = None
    rectification: Optional[dict] = None   # {name?, phone?, email?}


class GrievanceIn(BaseModel):
    email: str
    message: str
    request_id: Optional[UUID] = None


# ------------------------------------------------------------------------ public API

@router.post("/requests")
def create_request(data: CreateRequestIn, request: Request, db: Session = Depends(get_db)):
    """Create a data-rights request and email a one-time verification link."""
    _rate_limit(request, limit=5, window=300.0)
    email = (data.email or "").strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="A valid email is required")
    _rate_limit(request, limit=3, window=3600.0, key=f"dsar:email:{email}")

    try:
        rtype = DSARType(data.request_type)
        scope = DSARScope(data.scope or "company")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request_type or scope")

    # An invite token pins the request to one Fiduciary + strengthens identity.
    org_id = data.organisation_id
    if data.invite_token:
        inv = db.query(InterviewInvite).filter(InterviewInvite.token == data.invite_token).first()
        if inv and inv.job_id:
            job = db.query(Job).filter(Job.id == inv.job_id).first()
            if job and job.organisation_id:
                org_id = job.organisation_id
                scope = DSARScope.company

    token = generate_token()
    req = DataSubjectRequest(
        subject_email=email, request_type=rtype, scope=scope, organisation_id=org_id,
        status=DSARStatus.pending_verification,
        verification_token_hash=hash_token(token),
        token_expires_at=expiry_from_now(settings.DSAR_TOKEN_TTL_HOURS),
        due_at=_now() + timedelta(days=settings.DSAR_SLA_DAYS),
        requester_ip=_client_ip(request), requester_user_agent=_ua(request),
        payload={"rectification": data.rectification} if data.rectification else None,
    )
    db.add(req)
    db.commit()

    verify_url = _link(f"/api/privacy/requests/verify?rid={req.id}&token={token}")
    _send_verification_email(email, rtype, verify_url)
    record_audit(
        db, action="dsar.request.created", actor_type=AuditActorType.candidate, actor_id=email,
        organisation_id=org_id, entity_type="data_subject_request", entity_id=req.id,
        subject_email=email, detail={"type": rtype.value, "scope": scope.value},
        request_ip=_client_ip(request), user_agent=_ua(request),
    )
    return {"request_id": str(req.id), "status": req.status.value, "due_at": req.due_at.isoformat()}


@router.get("/requests/verify")
def verify_request(rid: UUID, token: str, request: Request, db: Session = Depends(get_db)):
    """Verify the emailed token, then fulfil export/rectification or present the erasure
    double-confirm. Returns a human page (clicked from an email)."""
    _rate_limit(request, limit=30, window=60.0)
    req = db.get(DataSubjectRequest, rid)
    if not req or not verify_token(token, req.verification_token_hash, req.token_expires_at):
        return _page("Link invalid or expired",
                     "<p>This verification link is invalid or has expired. Please start a new request.</p>",
                     status_code=400)

    if req.status in (DSARStatus.fulfilled, DSARStatus.cancelled, DSARStatus.expired):
        return _page("Already processed", f"<p>This request is <strong>{req.status.value}</strong>.</p>")

    if req.status == DSARStatus.pending_verification:
        req.status = DSARStatus.verified
        req.verified_at = _now()
        db.commit()
        record_audit(db, action="dsar.verified", actor_type=AuditActorType.candidate,
                     actor_id=req.subject_email, organisation_id=req.organisation_id,
                     entity_type="data_subject_request", entity_id=req.id,
                     subject_email=req.subject_email, request_ip=_client_ip(request), user_agent=_ua(request))

    if req.request_type == DSARType.access_export:
        etoken = generate_token()
        req.export_token_hash = hash_token(etoken)
        req.export_expires_at = expiry_from_now(settings.DSAR_TOKEN_TTL_HOURS)
        db.commit()
        dl = _link(f"/api/privacy/exports/{req.id}?token={etoken}")
        return _page("Verified — download your data",
                     f'<p>Your identity is confirmed. Download a copy of all data we hold about you:</p>'
                     f'<p><a class="btn" href="{dl}">Download my data (.zip)</a></p>'
                     f'<p class="muted">This link is single-use style and expires in {settings.DSAR_TOKEN_TTL_HOURS} hours.</p>')

    if req.request_type == DSARType.rectification:
        changes = (req.payload or {}).get("rectification") or {}
        data_rights.rectify_subject(
            db, req.subject_email, req.organisation_id, req.scope, changes,
            actor_type=AuditActorType.candidate, actor_id=req.subject_email, request_id=req.id,
            request_ip=_client_ip(request), user_agent=_ua(request),
        )
        req.status = DSARStatus.fulfilled
        req.fulfilled_at = _now()
        req.verification_token_hash = None
        db.commit()
        return _page("Details updated", "<p>Your details have been corrected across our records. Thank you.</p>")

    # erasure -> DOUBLE confirm (irreversible), token carried in the form action query.
    confirm_url = _link(f"/api/privacy/requests/{req.id}/confirm?token={token}")
    return _page(
        "Confirm permanent erasure",
        f'<p>You asked us to <strong>permanently erase</strong> your personal data'
        f'{" for this company" if req.scope == DSARScope.company else " across the whole platform"}. '
        f'This cannot be undone.</p>'
        f'<form method="post" action="{confirm_url}">'
        f'<button class="btn" type="submit">Yes, permanently erase my data</button></form>'
        f'<p class="muted">If you didn\'t request this, close this page and nothing will happen.</p>',
    )


@router.post("/requests/{rid}/confirm")
def confirm_erasure(rid: UUID, token: str, request: Request, db: Session = Depends(get_db)):
    """Second confirmation for an erasure — actually runs the anonymise-in-place."""
    _rate_limit(request, limit=10, window=300.0)
    req = db.get(DataSubjectRequest, rid)
    if not req or req.request_type != DSARType.erasure:
        return _page("Not found", "<p>We couldn't find that erasure request.</p>", status_code=404)
    if not verify_token(token, req.verification_token_hash, req.token_expires_at):
        return _page("Link invalid or expired", "<p>Please start a new request.</p>", status_code=400)
    if req.status == DSARStatus.fulfilled:
        return _page("Already erased", "<p>Your data has already been erased.</p>")
    if req.status not in (DSARStatus.verified, DSARStatus.in_progress):
        return _page("Not verified", "<p>Please use the verification link from your email first.</p>", status_code=400)

    req.status = DSARStatus.in_progress
    db.commit()
    try:
        data_rights.erase_subject(
            db, req, actor_type=AuditActorType.candidate, actor_id=req.subject_email,
            request_ip=_client_ip(request), user_agent=_ua(request),
        )
    except Exception:
        # erase_subject already recorded the failure + left status in_progress (resumable).
        return _page("We hit a snag",
                     "<p>Something went wrong finishing your erasure. Our team has been notified and it "
                     "will be completed shortly.</p>", status_code=500)

    req.verification_token_hash = None
    db.commit()
    _send_completion_email(req.subject_email)
    return _page("Your data has been erased",
                 "<p>Your personal data has been erased from our records. A confirmation has been emailed "
                 "to you. Note: any copy stored in your own browser clears on that device only.</p>")


@router.get("/requests/{rid}/status")
def request_status(rid: UUID, token: str, request: Request, db: Session = Depends(get_db)):
    """JSON status check for a request (token-gated)."""
    _rate_limit(request, limit=30, window=60.0)
    req = db.get(DataSubjectRequest, rid)
    if not req or not verify_token(token, req.verification_token_hash, req.token_expires_at):
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "request_id": str(req.id), "status": req.status.value, "request_type": req.request_type.value,
        "scope": req.scope.value, "due_at": req.due_at.isoformat() if req.due_at else None,
        "created_at": req.created_at.isoformat() if req.created_at else None,
        "fulfilled_at": req.fulfilled_at.isoformat() if req.fulfilled_at else None,
    }


@router.get("/exports/{rid}")
def download_export(rid: UUID, token: str, request: Request, db: Session = Depends(get_db)):
    """Serve the subject's data package as a ZIP (export token-gated, expiring)."""
    _rate_limit(request, limit=20, window=300.0)
    req = db.get(DataSubjectRequest, rid)
    if not req or req.request_type != DSARType.access_export:
        raise HTTPException(status_code=404, detail="Not found")
    if not verify_token(token, req.export_token_hash, req.export_expires_at):
        return _page("Link invalid or expired", "<p>Please start a new access request.</p>", status_code=403)

    package = data_export.build_export_package(db, req.subject_email, req.organisation_id, req.scope)
    raw = data_export.zip_export_package(package)

    if req.status != DSARStatus.fulfilled:
        req.status = DSARStatus.fulfilled
        req.fulfilled_at = _now()
        db.commit()
    record_audit(db, action="dsar.export.fulfilled", actor_type=AuditActorType.candidate,
                 actor_id=req.subject_email, organisation_id=req.organisation_id,
                 entity_type="data_subject_request", entity_id=req.id, subject_email=req.subject_email,
                 detail=package["manifest"]["counts"], request_ip=_client_ip(request), user_agent=_ua(request))
    return Response(
        content=raw, media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="my-interviehire-data.zip"'},
    )


@router.post("/grievances")
def file_grievance(data: GrievanceIn, request: Request, db: Session = Depends(get_db)):
    """File a grievance (DPDP §13). Recorded to the audit log + emailed to the DPO."""
    _rate_limit(request, limit=5, window=3600.0)
    email = (data.email or "").strip().lower()
    if "@" not in email or not (data.message or "").strip():
        raise HTTPException(status_code=400, detail="Email and message are required")
    _rate_limit(request, limit=3, window=3600.0, key=f"grievance:email:{email}")

    record_audit(db, action="dsar.grievance.filed", actor_type=AuditActorType.candidate,
                 actor_id=email, entity_type="data_subject_request",
                 entity_id=data.request_id, subject_email=email,
                 detail={"message": data.message[:2000], "request_id": str(data.request_id) if data.request_id else None},
                 request_ip=_client_ip(request), user_agent=_ua(request))
    try:
        send_html_email(
            settings.DPO_CONTACT_EMAIL, "New data-rights grievance",
            f"<p>Grievance from <strong>{email}</strong>"
            f"{f' (request {data.request_id})' if data.request_id else ''}:</p>"
            f"<blockquote>{(data.message or '')[:2000]}</blockquote>",
        )
        send_html_email(email, "We've received your grievance",
                        "<p>Thank you — we've received your grievance and will respond within the "
                        "statutory period. You may also escalate to the Data Protection Board if unsatisfied.</p>")
    except Exception:
        pass  # audit is the source of truth; email is best-effort
    return {"ok": True, "contact": settings.DPO_CONTACT_EMAIL}


# --------------------------------------------------------------------- internal / ops

@router.post("/internal/run-retention")
def run_retention_endpoint(request: Request, db: Session = Depends(get_db)):
    """Run the retention/auto-purge batch (DPDP §8). Internal-only (shared secret).
    Defaults to DRY-RUN; pass ?dry_run=false to actually anonymise. Safe no-op unless
    RETENTION_DAYS is configured. Trigger from a host cron or an external pinger."""
    secret = request.headers.get("x-internal-secret")
    if not settings.INTERNAL_SERVICE_SECRET or secret != settings.INTERNAL_SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")
    dry = request.query_params.get("dry_run", "true").lower() != "false"
    from app.jobs.retention import run_retention
    return run_retention(db, dry_run=dry)


# ---------------------------------------------------------------- recruiter/admin API

@router.get("/admin/requests")
def admin_list_requests(
    current_user: User = Depends(get_current_user),
    active_org_id: Optional[UUID] = Depends(get_active_org_id),
    db: Session = Depends(get_db),
):
    """List this organisation's data-rights requests (controller visibility)."""
    now = _now()
    rows = (
        db.query(DataSubjectRequest)
        .filter(DataSubjectRequest.organisation_id == active_org_id)
        .order_by(DataSubjectRequest.created_at.desc())
        .limit(200).all()
    )
    open_states = (DSARStatus.fulfilled, DSARStatus.cancelled, DSARStatus.expired)
    return [
        {
            "request_id": str(r.id), "subject_email": r.subject_email,
            "request_type": r.request_type.value, "status": r.status.value, "scope": r.scope.value,
            "due_at": r.due_at.isoformat() if r.due_at else None,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "fulfilled_at": r.fulfilled_at.isoformat() if r.fulfilled_at else None,
            "overdue": bool(r.due_at and r.status not in open_states and r.due_at < now),
        }
        for r in rows
    ]


@router.get("/admin/requests/{rid}")
def admin_request_detail(
    rid: UUID,
    current_user: User = Depends(get_current_user),
    active_org_id: Optional[UUID] = Depends(get_active_org_id),
    db: Session = Depends(get_db),
):
    """One request + its audit trail (scoped to the caller's organisation)."""
    req = db.get(DataSubjectRequest, rid)
    if not req or req.organisation_id != active_org_id:
        raise HTTPException(status_code=404, detail="Not found")
    audits = (
        db.query(ComplianceAuditLog)
        .filter(ComplianceAuditLog.subject_email == req.subject_email)
        .order_by(ComplianceAuditLog.created_at.desc())
        .limit(100).all()
    )
    return {
        "request": {
            "request_id": str(req.id), "subject_email": req.subject_email,
            "request_type": req.request_type.value, "status": req.status.value, "scope": req.scope.value,
            "due_at": req.due_at.isoformat() if req.due_at else None,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "fulfilled_at": req.fulfilled_at.isoformat() if req.fulfilled_at else None,
            "payload": req.payload,
        },
        "audit_trail": [
            {"action": a.action, "actor_type": a.actor_type.value if a.actor_type else None,
             "detail": a.detail, "created_at": a.created_at.isoformat() if a.created_at else None}
            for a in audits
        ],
    }


# ----------------------------------------------------------------------------- emails

def _send_verification_email(email: str, rtype: DSARType, verify_url: str) -> None:
    label = {
        DSARType.access_export: "access a copy of your data",
        DSARType.erasure: "erase your data",
        DSARType.rectification: "correct your data",
    }[rtype]
    try:
        send_html_email(
            email, "Verify your data-rights request",
            f"<p>We received a request to <strong>{label}</strong> with IntervieHire.</p>"
            f'<p><a href="{verify_url}">Click here to verify it was you</a>. '
            f"This link expires in {settings.DSAR_TOKEN_TTL_HOURS} hours.</p>"
            f"<p>If you didn't make this request, you can ignore this email.</p>",
        )
    except Exception:
        pass  # best-effort; the request still exists and can be re-verified


def _send_completion_email(email: str) -> None:
    try:
        send_html_email(
            email, "Your data has been erased",
            "<p>As requested, your personal data has been erased from IntervieHire's records. "
            "Any copy stored in your own browser clears on that device only.</p>",
        )
    except Exception:
        pass
