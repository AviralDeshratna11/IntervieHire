"""Retention / auto-purge job (DPDP Act 2023, §8).

Anonymises candidate data whose retention window has lapsed. It REUSES the runtime-verified
``anonymise_applicant`` (per-applicant scrub-to-stub + engine session + files + audit), so
this module is only *selection + batching + safety* — no new deletion logic.

Safe by default:
- **Disabled** unless ``RETENTION_DAYS`` > 0 — a no-op otherwise.
- **Dry-run** supported (report what WOULD be purged without touching anything).
- Skips already-anonymised rows and anyone still mid-pipeline (pending/scheduled interview).
- Bounded per run by ``RETENTION_MAX_PER_RUN``.

Trigger it however your host allows — both share this one function:
- CLI:      ``python -m app.jobs.retention [--dry-run] [--limit N]``
             (e.g. a Render Cron Job; run with --dry-run first, then arm)
- Endpoint: ``POST /api/privacy/internal/run-retention`` (x-internal-secret; ``?dry_run=false`` to arm)
"""
from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models.applicant import Applicant, InterviewStatus
from app.models.compliance_audit_log import AuditActorType
from app.utils.audit import record_audit
from app.utils.data_rights import anonymise_applicant

# Interview states meaning the candidate is still mid-pipeline — never purge these.
ACTIVE_STATES = (InterviewStatus.pending, InterviewStatus.scheduled)


def select_eligible(db: Session, days: int, limit: int):
    """Applicants past the retention window, not already anonymised, not mid-pipeline.

    Anchored conservatively: BOTH created_at and (attempted_at, if any) must predate the
    cutoff, so a candidate who interviewed recently is never purged on account of an old
    application date.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    return (
        db.query(Applicant)
        .filter(Applicant.anonymised_at.is_(None))
        .filter(Applicant.created_at < cutoff)
        .filter(or_(Applicant.attempted_at.is_(None), Applicant.attempted_at < cutoff))
        .filter(or_(Applicant.screening_status.is_(None), Applicant.screening_status.notin_(ACTIVE_STATES)))
        .filter(or_(Applicant.functional_status.is_(None), Applicant.functional_status.notin_(ACTIVE_STATES)))
        .order_by(Applicant.created_at.asc())
        .limit(limit)
        .all()
    )


def run_retention(db: Session, *, dry_run: bool = True, limit: Optional[int] = None) -> dict:
    """Run one retention batch. Returns a summary dict; audits a ``retention.run`` entry."""
    days = settings.RETENTION_DAYS
    if not days or days <= 0:
        return {"enabled": False, "reason": "RETENTION_DAYS not set", "eligible": 0, "anonymised": 0}

    batch = limit or settings.RETENTION_MAX_PER_RUN
    eligible = select_eligible(db, days, batch)
    result = {
        "enabled": True, "retention_days": days, "dry_run": dry_run,
        "eligible": len(eligible), "anonymised": 0, "errors": 0,
    }

    if dry_run:
        result["sample"] = [str(a.id) for a in eligible[:20]]
    else:
        for a in eligible:
            try:
                anonymise_applicant(db, a, actor_type=AuditActorType.system, actor_id="retention")
                result["anonymised"] += 1
            except Exception:
                db.rollback()
                result["errors"] += 1

    record_audit(db, action="retention.run", actor_type=AuditActorType.system,
                 detail={k: v for k, v in result.items() if k != "sample"})
    return result


def main(argv=None) -> None:
    import argparse
    parser = argparse.ArgumentParser(description="Run the candidate data retention/auto-purge job.")
    parser.add_argument("--dry-run", action="store_true", help="report only; anonymise nothing")
    parser.add_argument("--limit", type=int, default=None, help="max applicants this run")
    args = parser.parse_args(argv)

    db = SessionLocal()
    try:
        print(run_retention(db, dry_run=args.dry_run, limit=args.limit))
    finally:
        db.close()


if __name__ == "__main__":
    main()
