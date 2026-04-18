# .agents Workflow

This directory contains the AI-driven development workflow assets for the repository.

## Purpose

- Coordinate specialized AI skills in `.agents/skills/`
- Enforce contract-first development through `.agents/contracts/`
- Track decisions, audits, and recurring problems in logs
- Provide reusable templates for codegen and developer guidance

## Key files

- `.agents/config.json` — workflow metadata and quality gate commands
- `.agents/skills/` — skill definitions used by the orchestrator
- `.agents/contracts/` — API and schema contracts before implementation
- `.agents/templates/` — code templates and reusable scaffolds
- `.agents/audit_log.md` — audit results and pass/fail verdicts
- `.agents/issue_log.md` — recurring failures, root causes, and postmortems
- `.agents/CHANGELOG.md` — targeted warnings and important updates

## AI-Driven Development Flow

1. Read the last 10 entries in `issue_log.md` before starting a task.
2. Use `orchestrator.md` to select exactly two skill files for the current task.
3. For backend changes, define the API contract in `.agents/contracts/` first.
4. Generate code in small increments; keep features atomic and testable.
5. Run the quality gate commands from `config.json`.
6. If the audit fails, write a short root-cause note to `issue_log.md`.
7. If an error recurs twice, let `self_healer.md` propose a fix.
8. Sync documentation after every pass, especially `README.md` or `ARCHITECTURE.md`.

## Recommended commands

- Backend:
  - `cd backend && ruff check . --fix && black . && mypy .`
- Frontend:
  - `cd frontend && npm install && npm run lint`
- Full quality gate:
  - `python .agents/scripts/run_quality_gate.py --run`

## VS Code tasks

If you use VS Code, the workspace includes `.vscode/tasks.json` with tasks for:
- `Agent: Backend Install`
- `Agent: Frontend Install`
- `Agent: Backend Audit`
- `Agent: Frontend Audit`
- `Agent: Full Quality Gate`

## Extending the workflow

- Add new skills to `.agents/skills/`
- Add new contract definitions to `.agents/contracts/`
- Add reusable code templates to `.agents/templates/`
- Keep `config.json` aligned with the actual `.agents/` paths
