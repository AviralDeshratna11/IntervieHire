from sqlalchemy import Column, String, DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
import enum

from app.database import Base


class DSARType(str, enum.Enum):
    access_export = "access_export"
    erasure = "erasure"
    rectification = "rectification"


class DSARStatus(str, enum.Enum):
    pending_verification = "pending_verification"
    verified = "verified"
    in_progress = "in_progress"
    fulfilled = "fulfilled"
    rejected = "rejected"
    expired = "expired"
    cancelled = "cancelled"


class DSARScope(str, enum.Enum):
    company = "company"      # a single Data Fiduciary
    platform = "platform"    # every org holding this email


class DataSubjectRequest(Base):
    """A candidate (Data Principal) request under the DPDP Act 2023 — access/export,
    erasure, or rectification, initiated self-serve from the candidate portal.

    This row is itself a compliance record: retained after fulfilment as proof, and its
    identifiers are anonymised (row NOT deleted) if the subject is later erased. No FK to
    applicants/Candidate — the soft link is subject_email (+ organisation_id scope).
    """
    __tablename__ = "data_subject_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_email = Column(String, nullable=False, index=True)
    request_type = Column(Enum(DSARType), nullable=False)
    status = Column(Enum(DSARStatus), nullable=False, default=DSARStatus.pending_verification)
    # company = one Fiduciary (organisation_id set); platform = fan out across all orgs.
    scope = Column(Enum(DSARScope), nullable=False, default=DSARScope.company)
    organisation_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # controller scope; no FK

    # Identity verification: a one-time token is emailed to subject_email; only its hash
    # is stored, so a DB leak never yields a usable link. Single-use, time-boxed.
    verification_token_hash = Column(String, nullable=True, index=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # Single-use, expiring export-download link (hash only).
    export_token_hash = Column(String, nullable=True, index=True)
    export_expires_at = Column(DateTime(timezone=True), nullable=True)

    # DPDP §13 response SLA — overdue requests surface to the org.
    due_at = Column(DateTime(timezone=True), nullable=True)

    requester_ip = Column(String, nullable=True)
    requester_user_agent = Column(String, nullable=True)

    # Rectification diff, or the erasure/export manifest (stores + files touched).
    payload = Column(JSONB, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    fulfilled_at = Column(DateTime(timezone=True), nullable=True)
