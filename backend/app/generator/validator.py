"""
Consistency validator – verifies that the LLM-generated file set is coherent
with the original ProjectConfig before packaging.

Checks:
  • Every file path is relative and sandboxed (no path traversal).
  • A README.md exists.
  • Package manifest (package.json / requirements.txt) exists when expected.
  • Database model file exists if a database was requested.
  • Auth middleware file exists if auth is enabled.
  • Test files exist if a testing framework was chosen.
"""

from __future__ import annotations

import logging
import posixpath

from app.models import (
    BackendChoice,
    DatabaseChoice,
    GeneratedFile,
    ProjectConfig,
    TestingFramework,
)

logger = logging.getLogger(__name__)


class ValidationError(Exception):
    """Raised when the generated file set does not satisfy consistency rules."""


def validate(config: ProjectConfig, files: list[GeneratedFile]) -> None:
    """
    Raise ``ValidationError`` with a human-readable message if the generated
    *files* are inconsistent with *config*.  Does nothing when everything
    looks good.
    """
    errors: list[str] = []
    paths = {f.path for f in files}

    # ── Path safety ───────────────────────────────────────────────────
    for f in files:
        if f.path.startswith("/") or ".." in f.path.split("/"):
            errors.append(f"Unsafe path detected: {f.path}")
        # Normalise and re-check
        resolved = posixpath.normpath(f.path)
        if resolved.startswith("..") or resolved.startswith("/"):
            errors.append(f"Path escapes sandbox after normalisation: {f.path}")

    # ── Required artefacts ────────────────────────────────────────────
    if not _any_match(paths, "README.md"):
        errors.append("Missing README.md")

    # Package manifest
    backend = config.stack.backend
    if backend in (BackendChoice.FASTAPI,):
        if not _any_match(paths, "requirements.txt"):
            errors.append("Missing requirements.txt for Python backend")
    elif backend in (BackendChoice.EXPRESS, BackendChoice.NESTJS):
        if not _any_match(paths, "package.json"):
            errors.append("Missing package.json for Node backend")

    # Database ORM
    if config.stack.database != DatabaseChoice.NONE:
        model_keywords = ("model", "schema", "entity", "orm")
        if not any(
            any(kw in p.lower() for kw in model_keywords) for p in paths
        ):
            errors.append(
                "Database was requested but no model/schema/entity file found"
            )

    # Auth
    if config.auth.enabled:
        auth_keywords = ("auth", "middleware", "guard")
        if not any(
            any(kw in p.lower() for kw in auth_keywords) for p in paths
        ):
            errors.append(
                "Auth is enabled but no auth middleware/guard file found"
            )

    # Tests
    if config.quality.testing_framework != TestingFramework.NONE:
        test_keywords = ("test", "spec", "__tests__")
        if not any(
            any(kw in p.lower() for kw in test_keywords) for p in paths
        ):
            errors.append(
                "Testing framework was chosen but no test file found"
            )

    # ── Verdict ───────────────────────────────────────────────────────
    if errors:
        msg = "Validation failed:\n  • " + "\n  • ".join(errors)
        logger.warning(msg)
        raise ValidationError(msg)

    logger.info("Validation passed for %d files", len(files))


# ── Helpers ───────────────────────────────────────────────────────────


def _any_match(paths: set[str], filename: str) -> bool:
    """Return True if any path ends with *filename*."""
    return any(p.endswith(filename) for p in paths)
