# Agent Workflow Reference

## Phase 1: Planning

- Start with `issue_log.md` to see the latest problems.
- Review `CORE_RULES.md` and confirm the task is within MVP scope.
- Choose two skill files from `.agents/skills/` for the current objective.

## Phase 2: Contract & Design

- Define or update the contract files in `.agents/contracts/` before coding.
- Backend APIs should have request/response schemas in `api_spec.ts`.
- Database changes should first be represented in `database_schema.ts`.

## Phase 3: Implementation

- Generate code in small, reviewable increments.
- Keep UI components under 100 lines and move logic into actions/hooks.
- Use structured logging and avoid raw `console.log` or print-style debugging.

## Phase 4: Audit

- Run the commands from `.agents/config.json`.
- Use `quality_auditor.md` as the judgement engine for risk classification.
- If the audit passes, update docs and record `PASS` in `audit_log.md`.
- If it fails, log the problem and try one corrective pass.

## Phase 5: Healing

- If the same failure appears twice in `issue_log.md`, invoke `self_healer.md`.
- The self-healer will analyze the pattern and patch weak rules or expert guidance.
- Confirm the fix in the next task and log success in `audit_log.md`.

## Notes

- `.agents` is the source of truth for AI orchestration, not the source code itself.
- Keeping `.agents/config.json` path-aligned is essential for automation.
- Any new dependency should be justified by “high value or unavoidable complexity.”
