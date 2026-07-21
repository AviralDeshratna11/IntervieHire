"""One-time tokens for candidate self-serve data-rights requests (DPDP Act 2023).

A random URL-safe token is emailed to the Data Principal; only its SHA-256 hash is
persisted (``verification_token_hash`` / ``export_token_hash``), so a DB leak never
exposes a usable link. Tokens are single-use (cleared on consumption by the caller) and
time-boxed via ``DSAR_TOKEN_TTL_HOURS``.
"""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional


def generate_token() -> str:
    """A fresh, cryptographically-random URL-safe token to email to the subject."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """SHA-256 hex digest — what we persist and compare against."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verify_token(token: str, token_hash: Optional[str], expires_at: Optional[datetime]) -> bool:
    """True iff ``token`` matches the stored hash and has not expired.

    Uses a constant-time compare. A missing token/hash, or a past expiry, always fails.
    Naive datetimes from the DB are treated as UTC.
    """
    if not token or not token_hash:
        return False
    if expires_at is not None:
        exp = expires_at if expires_at.tzinfo else expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > exp:
            return False
    return secrets.compare_digest(hash_token(token), token_hash)


def expiry_from_now(hours: int) -> datetime:
    """UTC timestamp ``hours`` in the future — for token_expires_at / export_expires_at."""
    return datetime.now(timezone.utc) + timedelta(hours=hours)
