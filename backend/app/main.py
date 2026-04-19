"""
AI Project Generator – FastAPI application entry-point.

Exposes:
  POST /generate   →  accept a ProjectConfig, call the LLM, validate, and
                       return a ZIP download.
  GET  /health     →  lightweight liveness check.
"""

from __future__ import annotations

import json
import logging
import re

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import ValidationError as PydanticValidationError

from app.generator.validator import ValidationError, validate
from app.generator.zipper import PathTraversalError, create_zip
from app.llm.prompt_builder import build_prompt
from app.llm.provider import get_llm_provider
from app.models import GeneratedFile, GenerationResult, ProjectConfig

# ── Logging setup (Rule 5 – structured logging, no print) ────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


# ── Helpers ───────────────────────────────────────────────────────────

def _clean_llm_output(raw: str) -> str:
    if not raw:
        return ""
    raw = raw.strip()

    # Find the VERY FIRST '{' and the VERY LAST '}'
    # This ignores everything outside the main JSON object
    start = raw.find('{')
    end = raw.rfind('}')
    
    if start != -1 and end != -1:
        return raw[start:end+1].strip()

    return raw

# ── App ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Project Generator",
    version="0.1.0",
    description="Generate production-ready project scaffolds powered by LLMs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate")
async def generate_project(config: ProjectConfig) -> StreamingResponse:
    """
    Accept a project configuration, invoke the LLM to produce files,
    validate the output, and stream back a ZIP archive.
    """
    logger.info("Generation request: %s", config.basics.project_name)

    # 1. Build the directive prompt
    prompt = build_prompt(config)

    # 2. Call the LLM
    try:
        provider = get_llm_provider()
        raw_response = await provider.generate(prompt)
    except Exception as exc:
        logger.error("LLM call failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc

    # 3. Clean & parse the JSON response
    logger.info("Raw LLM response (first 500 chars): %s", raw_response[:500])
    cleaned = _clean_llm_output(raw_response)
    try:
        parsed = json.loads(cleaned)
        
        if "files" not in parsed:
            raise KeyError("The LLM response is missing the 'files' key.")
            
        files = [GeneratedFile(**f) for f in parsed["files"]]
    except (json.JSONDecodeError, KeyError, PydanticValidationError, TypeError) as exc:
        logger.error("Failed to parse LLM output: %s", exc)
        # ── Diagnostic Dump ──
        try:
            with open("last_failed_raw.txt", "w", encoding="utf-8") as f:
                f.write(raw_response)
            logger.info("Dumped failed LLM response to 'last_failed_raw.txt'")
        except Exception as dump_exc:
            logger.error("Failed to dump diagnostic file: %s", dump_exc)
            
        raise HTTPException(
            status_code=502,
            detail="LLM returned unparseable output. Try a smaller project spec or check last_failed_raw.txt",
        ) from exc

    # 4. Validate consistency
    try:
        validate(config, files)
    except ValidationError as exc:
        logger.warning("Validation failed: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # 5. Package into ZIP
    try:
        slug = config.basics.project_name.lower().replace(" ", "-")
        zip_buf = create_zip(files, root_name=slug)
        file_size = zip_buf.getbuffer().nbytes
    except PathTraversalError as exc:
        logger.error("Path traversal blocked: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    logger.info("Returning ZIP for '%s' (%d files, %d bytes)", slug, len(files), file_size)

    return Response(
        content=zip_buf.getvalue(),
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{slug}.zip"',
            "Content-Length": str(file_size),
        },
    )


@app.post("/generate/preview")
async def preview_generation(config: ProjectConfig) -> GenerationResult:
    """
    Same as /generate but returns the JSON file listing instead of a ZIP.
    Useful for the frontend to show a preview before downloading.
    """
    logger.info("Preview request: %s", config.basics.project_name)

    prompt = build_prompt(config)

    try:
        provider = get_llm_provider()
        raw_response = await provider.generate(prompt)
    except Exception as exc:
        logger.error("LLM call failed: %s", exc)
        return GenerationResult(error=f"LLM error: {exc}")

    cleaned = _clean_llm_output(raw_response)
    try:
        parsed = json.loads(cleaned)
        files = [GeneratedFile(**f) for f in parsed["files"]]
    except (json.JSONDecodeError, KeyError, PydanticValidationError) as exc:
        logger.error("Failed to parse LLM output: %s", exc)
        # ── Diagnostic Dump ──
        try:
            with open("last_failed_raw_preview.txt", "w", encoding="utf-8") as f:
                f.write(raw_response)
        except:
            pass
        return GenerationResult(error="LLM returned unparseable output. Preview failed.")

    try:
        validate(config, files)
    except ValidationError as exc:
        return GenerationResult(error=str(exc))

    return GenerationResult(data=files)
