"""Integration tests for the retention / auto-purge job.

Verifies the SELECTION + safety rules against a real Postgres (the anonymise itself is
already covered by test_data_rights). Requires TEST_DATABASE_URL (a throwaway DB).
"""
import os
import sys
from datetime import datetime, timezone, timedelta

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TEST_DB = os.environ.get("TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(
    not TEST_DB, reason="set TEST_DATABASE_URL to a disposable Postgres to run these"
)

if TEST_DB:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    import app.models  # noqa: F401
    from app.database import Base
    from app.config import settings
    from app.models.organisation import Organisation
    from app.models.job import Job
    from app.models.applicant import Applicant, InterviewStatus
    from app.utils import data_rights
    from app.jobs import retention

    _engine = create_engine(TEST_DB)
    _Session = sessionmaker(bind=_engine)


@pytest.fixture
def db(monkeypatch):
    Base.metadata.create_all(bind=_engine)
    # No engine HTTP hop; enable retention with a 30-day window.
    monkeypatch.setattr(data_rights, "_erase_engine_files", lambda ids, rid: {"count": 0})
    monkeypatch.setattr(settings, "RETENTION_DAYS", 30)
    session = _Session()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=_engine)


def _applicant(db, days_ago, tag, **kw):
    org = Organisation(org_name="Acme"); db.add(org); db.flush()
    job = Job(title="BE", role_name="BE", organisation_id=org.id); db.add(job); db.flush()
    a = Applicant(
        name="X", email=f"{tag}@e.com", job_id=job.id, resume_text="pii",
        created_at=datetime.now(timezone.utc) - timedelta(days=days_ago), **kw,
    )
    db.add(a); db.commit()
    return a


def test_purges_only_eligible(db):
    old = _applicant(db, 400, "old")
    recent = _applicant(db, 5, "recent")
    active = _applicant(db, 400, "active", screening_status=InterviewStatus.pending)

    res = retention.run_retention(db, dry_run=False)
    assert res["enabled"] is True and res["anonymised"] == 1

    for a in (old, recent, active):
        db.refresh(a)
    assert old.anonymised_at is not None and old.name == "[erased]"   # lapsed -> anonymised
    assert recent.anonymised_at is None                               # within window -> kept
    assert active.anonymised_at is None                               # mid-pipeline -> protected


def test_disabled_when_unset(db, monkeypatch):
    monkeypatch.setattr(settings, "RETENTION_DAYS", 0)
    _applicant(db, 400, "old")
    res = retention.run_retention(db, dry_run=False)
    assert res["enabled"] is False and res["anonymised"] == 0


def test_dry_run_changes_nothing(db):
    old = _applicant(db, 400, "old")
    res = retention.run_retention(db, dry_run=True)
    assert res["eligible"] >= 1 and res["anonymised"] == 0
    db.refresh(old)
    assert old.anonymised_at is None
