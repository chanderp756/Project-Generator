"""
ZIP packager – writes generated files into an in-memory ZIP archive.

Security: applies strict path sandboxing before writing any entry.
"""

from __future__ import annotations

import io
import logging
import posixpath
import zipfile

from app.models import GeneratedFile

logger = logging.getLogger(__name__)


class PathTraversalError(Exception):
    """Raised when a file path attempts to escape the project root."""


def create_zip(
    files: list[GeneratedFile],
    root_name: str = "project",
) -> io.BytesIO:
    buf = io.BytesIO()

    # Ensure the ZIP is written completely
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            safe_path = _sanitise(f.path)
            full_path = posixpath.join(root_name, safe_path)
            zf.writestr(full_path, f.content)
            logger.debug("Zipped: %s", full_path)
    
    # After the 'with' block, the ZIP central directory is written.
    # Now we reset the pointer.
    buf.seek(0)
    
    # Check if we actually wrote anything
    size = buf.getbuffer().nbytes
    if size == 0:
        logger.error("ZIP creation resulted in 0 bytes!")
        
    logger.info("Created ZIP with %d entries (%d bytes)", len(files), size)
    return buf


# ── Internal ──────────────────────────────────────────────────────────


def _sanitise(path: str) -> str:
    """
    Normalise *path* and verify it stays within the project sandbox.

    Raises ``PathTraversalError`` on any violation.
    """
    # Strip leading slashes and backslashes
    cleaned = path.lstrip("/").lstrip("\\").replace("\\", "/")
    normalised = posixpath.normpath(cleaned)

    if normalised.startswith("..") or normalised.startswith("/"):
        raise PathTraversalError(
            f"Path traversal attempt blocked: '{path}' → '{normalised}'"
        )

    return normalised
