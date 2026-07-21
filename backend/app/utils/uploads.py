"""Shared upload-path helpers.

Canonical home for the resume/JD upload primitives so both the authenticated
recruiter routes (`app/routers/jobs.py`) and the public candidate-apply routes
(`app/routers/public.py`) resolve filenames through the SAME traversal / zip-slip
defense instead of keeping drifting copies of security-sensitive code.
"""
import os
from typing import Optional


def ensure_upload_dir(path: str) -> None:
    """Create an upload dir with owner-only perms.

    chmod is best-effort — a no-op on Windows, but on the Linux host it keeps
    resume/JD files from being world-readable by other processes on the box.
    """
    os.makedirs(path, exist_ok=True)
    try:
        os.chmod(path, 0o700)
    except OSError:
        pass


def safe_upload_path(base_dir: str, filename: str) -> Optional[str]:
    """Resolve a caller-supplied filename inside base_dir, defending against
    path traversal / zip-slip.

    Strips any directory components, then verifies the realpath stays within
    base_dir. Returns None for empty or otherwise unsafe names so the caller
    can skip them instead of writing outside the upload root.
    """
    name = os.path.basename(filename or "").strip()
    if not name or name in (".", ".."):
        return None
    target = os.path.join(base_dir, name)
    base_real = os.path.realpath(base_dir)
    target_real = os.path.realpath(target)
    if target_real != base_real and not target_real.startswith(base_real + os.sep):
        return None
    return target
