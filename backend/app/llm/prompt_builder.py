"""
Prompt builder – translates a ProjectConfig into a highly directive LLM prompt
that enforces structured JSON output with fully populated file contents.

The prompt explicitly forbids TODO / placeholder comments and requires
real, compilable source code.
"""

from __future__ import annotations
from app.models import BackendChoice, ProjectConfig, TestingFramework

def build_prompt(config: ProjectConfig) -> str:
    """Return the master generation prompt for the given *config*."""

    sections = _build_sections(config)

    return f"""\
You are an expert full-stack software engineer. Given the project specification
below, generate a complete, production-ready project scaffold.

──────────────────────────────────────────────────────────────
PROJECT SPECIFICATION
──────────────────────────────────────────────────────────────
{sections}

──────────────────────────────────────────────────────────────
OUTPUT FORMAT (follow EXACTLY)
──────────────────────────────────────────────────────────────
You MUST return ONLY a JSON object. No conversational text, no explanations.
Your response MUST start with `{{` and end with `}}`.

Format:
{{
  "files": [
    {{
      "path": "src/main.py",
      "content": "..."
    }}
  ]
}}

──────────────────────────────────────────────────────────────
HARD CONSTRAINTS & JSON HYGIENE
──────────────────────────────────────────────────────────────
1. Return ONLY raw JSON. No markdown fences (```json), no commentary.
2. Ensure all special characters in "content" (newlines, quotes) are PROPERLY ESCAPED for JSON.
3. Your response MUST start with `{{` and end with `}}`.
4. Do NOT include any text before or after the JSON object.

──────────────────────────────────────────────────────────────
CRITICAL VALIDATION CHECKLIST (Do not skip!)
──────────────────────────────────────────────────────────────
Your response will be REJECTED unless it includes:
1.  **README.md**: Must contain project title and setup instructions.
2.  **Auth Implementation**: Since Auth is enabled, you MUST include a specific file for auth middleware/guards (e.g., `middleware/auth.py` or `guards/auth.ts`).
3.  **Test Suite**: Since Testing is requested, you MUST include at least one example test file (e.g., `tests/test_main.py` or `src/__tests__/app.spec.ts`).
4.  **No Placeholders**: Write the ACTUAL code. Do not use "// code here".
5.  **Dependencies**: You MUST include a dependency management file (e.g., `requirements.txt` for Python) with the exact dependencies listed in the [Required Dependencies] section. Do not add extra dependencies unless necessary for the specific implementation. Ensure the file format is correct (e.g., one package per line for requirements.txt).
6.  **Database Schema**: Since a database is specified, you MUST include a file defining the schema, models, or migrations (e.g., `models.py`, `schema.sql`, or `entities.ts`).
7.  **Folder Structure**: You MUST organize files according to the [Folder Structure] guidelines. Place files in the appropriate directories as specified.

Return ONLY the JSON.
"""

def _build_sections(config: ProjectConfig) -> str:
    lines: list[str] = []
    b = config.basics
    lines.append(f"Project Name : {b.project_name}")
    lines.append(f"Description  : {b.description}")
    lines.append(f"Version      : {b.version}")
    lines.append("")

    s = config.stack
    lines.append("[Tech Stack]")
    lines.append(f"  Frontend  : {s.frontend.value}")
    lines.append(f"  Backend   : {s.backend.value}")
    lines.append(f"  Database  : {s.database.value}")
    lines.append(f"  Styling   : {s.styling.value}")
    lines.append("")

    # Add folder structure
    lines.append("[Folder Structure]")
    if config.stack.backend == BackendChoice.FASTAPI:
        lines.append("  Backend (Layered Architecture - MVC-like):")
        lines.append("    - models/ : Data models and schemas")
        lines.append("    - routers/ : API route handlers (controllers)")
        lines.append("    - services/ : Business logic layer")
        lines.append("    - repositories/ : Data access layer")
        lines.append("    - core/ : Configuration, database connections")
        lines.append("    - utils/ : Helper functions")
        lines.append("    - tests/ : Unit and integration tests")
    else:
        lines.append("  Backend: Standard structure for the chosen framework")
    lines.append("  Frontend (Feature-Driven Architecture):")
    lines.append("    - features/ : Feature-based organization")
    lines.append("      - feature1/ : Components, services, hooks for feature1")
    lines.append("      - feature2/ : Components, services, hooks for feature2")
    lines.append("    - shared/ : Shared components, utilities, hooks")
    lines.append("    - core/ : Global config, API clients, constants")
    lines.append("    - assets/ : Images, styles, etc.")
    lines.append("")

    # Add dependencies section
    lines.append("[Required Dependencies]")
    deps = _get_dependencies(config)
    for dep in deps:
        lines.append(f"  - {dep}")
    lines.append("")

    a = config.auth
    lines.append("[Authentication]")
    if a.enabled:
        lines.append(f"  Provider : {a.provider.value if a.provider else 'Custom'}")
        lines.append(f"  Type     : {a.type.value if a.type else 'JWT'}")
    else:
        lines.append("  Disabled")
    lines.append("")

    i = config.infrastructure
    lines.append("[Infrastructure]")
    lines.append(f"  Deployment : {i.deployment.value}")
    lines.append(f"  CI/CD      : {i.ci_cd.value}")
    lines.append("")

    q = config.quality
    lines.append("[Dev Quality]")
    lines.append(f"  Testing    : {q.testing_framework.value}")
    lines.append(f"  Linting    : {'yes' if q.linting else 'no'}")
    lines.append(f"  Formatter  : {'yes' if q.formatting else 'no'}")
    lines.append(f"  TypeCheck  : {'yes' if q.type_checking else 'no'}")
    lines.append("")

    e = config.extras
    lines.append("[Extras]")
    lines.append(f"  Analytics     : {e.analytics.value}")
    lines.append(f"  Error Logging : {e.error_logging.value}")

    return "\n".join(lines)


def _get_dependencies(config: ProjectConfig) -> list[str]:
    """Return a list of required dependencies based on the config."""
    deps = []
    backend = config.stack.backend
    if backend == BackendChoice.FASTAPI:
        deps.extend([
            "fastapi",
            "uvicorn[standard]",
            "pydantic",
        ])
        if config.stack.database == DatabaseChoice.POSTGRESQL:
            deps.extend(["psycopg2-binary", "sqlalchemy"])
        elif config.stack.database == DatabaseChoice.MONGODB:
            deps.extend(["motor", "pymongo"])
        elif config.stack.database == DatabaseChoice.SQLITE:
            deps.extend(["sqlalchemy"])
        if config.auth.enabled:
            deps.extend(["python-jose[cryptography]", "passlib[bcrypt]"])
        if config.quality.testing_framework == TestingFramework.PYTEST:
            deps.extend(["pytest", "httpx"])
        if config.quality.linting:
            deps.append("ruff")
        if config.quality.formatting:
            deps.append("black")
        if config.quality.type_checking:
            deps.append("mypy")
    elif backend in (BackendChoice.EXPRESS, BackendChoice.NESTJS):
        # For Node.js, this will be in package.json
        pass  # LLM will handle based on instructions
    # Add more backends as needed
    return deps
            