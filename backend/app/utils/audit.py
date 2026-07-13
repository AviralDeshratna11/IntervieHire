"""General-purpose compliance/activity audit log for the core hiring app.

Generalises the talent_finder ``audit()`` helper (app/talent_finder/service.py) to the
whole platform. Writes to ``compliance_audit_logs``, which has no FK to its subject so
the trail survives erasure — the DPDP Act 2023 proof-of-compliance record.

Best-effort by design: a logging failure must NEVER break the action being logged, so
every write is wrapped in try/except with a rollback. Pass ``commit=False`` to enlist the
audit row in a surrounding transaction (e.g. a multi-step erasure) and commit once at the end.
"""
from typing import Optional
from sqlalchemy.orm import Session

from app.models.compliance_audit_log import ComplianceAuditLog, AuditActorType


def record_audit(
    db: Session,
    *,
    action: str,
    actor_type: AuditActorType = AuditActorType.system,
    actor_id: Optional[str] = None,
    organisation_id=None,
    entity_type: Optional[str] = None,
    entity_id=None,
    subject_email: Optional[str] = None,
    detail: Optional[dict] = None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    commit: bool = True,
) -> None:
    """Append one row to the compliance audit log. Never raises."""
    try:
        db.add(ComplianceAuditLog(
            action=action,
            actor_type=actor_type,
            actor_id=str(actor_id) if actor_id else None,
            organisation_id=organisation_id,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id else None,
            subject_email=subject_email,
            detail=detail or {},
            request_ip=request_ip,
            user_agent=user_agent,
        ))
        if commit:
            db.commit()
    except Exception:
        db.rollback()
