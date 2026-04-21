"""
Pydantic models mirroring the TypeScript contracts in .agents/contracts/project_config.ts.
These models are the single source of truth for request validation on the Python side.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ─────────────────────────────────────────────────────────────


class FrontendChoice(str, Enum):
    REACT = "React"
    NEXTJS = "Next.js"
    VUE = "Vue"
    SVELTE = "Svelte"


class BackendChoice(str, Enum):
    FASTAPI = "FastAPI"
    EXPRESS = "Express"
    GO = "Go"
    NESTJS = "NestJS"


class DatabaseChoice(str, Enum):
    POSTGRESQL = "PostgreSQL"
    MONGODB = "MongoDB"
    SQLITE = "SQLite"
    NONE = "none"


class StylingChoice(str, Enum):
    TAILWIND = "Tailwind"
    CSS_MODULES = "CSS-Modules"
    STYLED_COMPONENTS = "Styled-Components"


class AuthProvider(str, Enum):
    FIREBASE = "Firebase"
    AUTH0 = "Auth0"
    NEXTAUTH = "NextAuth"
    CUSTOM = "Custom"


class AuthType(str, Enum):
    JWT = "JWT"
    SESSION = "Session"
    OAUTH = "OAuth"


class DeploymentTarget(str, Enum):
    VERCEL = "Vercel"
    NETLIFY = "Netlify"
    DOCKER = "Docker"
    AWS = "AWS"
    NONE = "none"


class CICDChoice(str, Enum):
    GITHUB_ACTIONS = "GitHub Actions"
    GITLAB_CI = "GitLab CI"
    NONE = "none"


class TestingFramework(str, Enum):
    JEST = "Jest"
    PYTEST = "Pytest"
    VITEST = "Vitest"
    NONE = "none"


class AnalyticsChoice(str, Enum):
    GOOGLE_ANALYTICS = "Google Analytics"
    PLAUSIBLE = "Plausible"
    NONE = "none"


class ErrorLoggingChoice(str, Enum):
    SENTRY = "Sentry"
    LOGROCKET = "LogRocket"
    NONE = "none"


# ── Sub-models ────────────────────────────────────────────────────────


class ProjectBasics(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=64)
    description: str = Field("", max_length=512)
    version: str = Field("0.1.0")


class TechStack(BaseModel):
    frontend: FrontendChoice
    backend: BackendChoice
    database: DatabaseChoice = DatabaseChoice.NONE
    styling: StylingChoice = StylingChoice.TAILWIND


class AuthConfig(BaseModel):
    enabled: bool = False
    provider: Optional[AuthProvider] = None
    type: Optional[AuthType] = None


class Infrastructure(BaseModel):
    deployment: DeploymentTarget = DeploymentTarget.NONE
    ci_cd: CICDChoice = CICDChoice.NONE


class DevQuality(BaseModel):
    testing_framework: TestingFramework = TestingFramework.NONE
    linting: bool = True
    formatting: bool = True
    type_checking: bool = True


class Extras(BaseModel):
    analytics: AnalyticsChoice = AnalyticsChoice.NONE
    error_logging: ErrorLoggingChoice = ErrorLoggingChoice.NONE


# ── Root model ────────────────────────────────────────────────────────


class ProjectConfig(BaseModel):
    """Full project configuration sent by the frontend wizard."""

    basics: ProjectBasics
    stack: TechStack
    auth: AuthConfig = AuthConfig()
    infrastructure: Infrastructure = Infrastructure()
    quality: DevQuality = DevQuality()
    extras: Extras = Extras()


# ── API response wrapper (Rule 2 from CORE_RULES) ────────────────────


class GeneratedFile(BaseModel):
    path: str
    content: str


class GenerationResult(BaseModel):
    data: Optional[list[GeneratedFile]] = None
    error: Optional[str] = None
