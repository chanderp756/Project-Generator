"""
LLM Provider abstraction layer.

Implements a factory pattern with a common async interface so the rest of the
application never directly imports vendor SDKs.  Adheres to CORE_RULES
Rule 3 (async-first) and Rule 8 (dependency minimalization — reuses the
already-declared SDK packages from requirements.txt).
"""

from __future__ import annotations

import logging
import os
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class BaseLLMProvider(ABC):
    """Minimal interface every LLM provider must satisfy."""

    @abstractmethod
    async def generate(self, prompt: str) -> str:
        """Send *prompt* to the model and return the raw text response."""


# ── Gemini ────────────────────────────────────────────────────────────


class GeminiProvider(BaseLLMProvider):
    def __init__(self) -> None:
        import google.generativeai as genai  # lazy import (Rule 8)

        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise EnvironmentError("GEMINI_API_KEY is not set")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel("gemini-2.0-flash")

    async def generate(self, prompt: str) -> str:
        response = await self._model.generate_content_async(prompt)
        return response.text


# ── OpenAI ────────────────────────────────────────────────────────────


class OpenAIProvider(BaseLLMProvider):
    def __init__(self) -> None:
        from openai import AsyncOpenAI

        api_key = os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            raise EnvironmentError("OPENAI_API_KEY is not set")
        self._client = AsyncOpenAI(api_key=api_key)

    async def generate(self, prompt: str) -> str:
        response = await self._client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content or ""


# ── Claude (Anthropic) ───────────────────────────────────────────────


class ClaudeProvider(BaseLLMProvider):
    def __init__(self) -> None:
        from anthropic import AsyncAnthropic

        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY is not set")
        self._client = AsyncAnthropic(api_key=api_key)

    async def generate(self, prompt: str) -> str:
        message = await self._client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}],
        )
        return message.content[0].text


# ── Groq (free tier – Llama 3.3 70B) ─────────────────────────────────


class GroqProvider(BaseLLMProvider):
    def __init__(self) -> None:
        from groq import AsyncGroq

        api_key = os.environ.get("GROQ_API_KEY", "")
        if not api_key:
            raise EnvironmentError("GROQ_API_KEY is not set")
        self._client = AsyncGroq(api_key=api_key)

    async def generate(self, prompt: str) -> str:
        response = await self._client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=8192,
        )
        return response.choices[0].message.content or ""


# ── Factory ──────────────────────────────────────────────────────────

_PROVIDERS: dict[str, type[BaseLLMProvider]] = {
    "gemini": GeminiProvider,
    "openai": OpenAIProvider,
    "claude": ClaudeProvider,
    "groq": GroqProvider,
}


def get_llm_provider(name: str | None = None) -> BaseLLMProvider:
    """
    Instantiate the LLM provider identified by *name*.

    Falls back to the ``LLM_PROVIDER`` env-var when *name* is ``None``.
    """
    provider_name = (name or os.environ.get("LLM_PROVIDER", "gemini")).lower()
    cls = _PROVIDERS.get(provider_name)
    if cls is None:
        raise ValueError(
            f"Unknown LLM provider '{provider_name}'. "
            f"Available: {', '.join(_PROVIDERS)}"
        )
    logger.info("Initializing LLM provider: %s", provider_name)
    return cls()
