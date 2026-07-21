from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
import enum

from app.database import Base


class AuditActorType(str, enum.Enum):
    candidate = "candidate"
    recruiter = "recruiter"
    system = "system"
    admin = "admin"


class ComplianceAuditLog(Base):
    """Append-only, general-purpose compliance/activity log for the core hiring app.

    Deliberately has NO foreign key to whatever it references (mirrors the ConsentLog
    design): the trail must OUTLIVE an erased/anonymised Data Principal, so it can never
    be cascaded away. This is the platform's proof-of-compliance under the DPDP Act 2023.

    Generalises the talent_finder audit log to the whole hiring app (jobs, applicants,
    users, DSAR requests) — see app/utils/audit.py for the writer.
    """
    __tablename__ = "compliance_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Data Fiduciary the action falls under. No FK — the log survives org/candidate deletes.
    organisation_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    actor_type = Column(Enum(AuditActorType), nullable=False)
    # User id for recruiter/admin actors; subject email for candidate/system actors.
    actor_id = Column(String, nullable=True)
    # e.g. 'dsar.request.created', 'dsar.verified', 'applicant.anonymised', 'applicant.rectified'.
    action = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=True)   # 'applicant' | 'data_subject_request' | 'candidate' | ...
    entity_id = Column(String, nullable=True)
    # The Data Principal this action concerns (kept even after the subject is anonymised).
    subject_email = Column(String, nullable=True, index=True)
    # Structured detail: stores touched, row counts, files unlinked, redacted diff, etc.
    detail = Column(JSONB, nullable=True)
    request_ip = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
