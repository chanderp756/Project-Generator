# Skill: Quality Auditor (The Judge)

## Audit Protocols (Matches agent\_workflow\_audit\_detail.svg)

### 1. Risk Classification

* **LOW:** Pure UI/CSS, documentation, or non-logic refactors.
* **MEDIUM:** API route changes, state management updates, new dependencies.
* **HIGH:** Schema migrations, Authentication logic, PII handling, or Security patches.

### 2. Checklist Enforcement

| Risk Level | Required Checks                                                                                          |
| :--------- | :------------------------------------------------------------------------------------------------------- |
| **Low**    | Did what asked? • No PII in logs? • Doc sync done?                                                       |
| **Medium** | All Low checks + No sync IO in async? • Unbounded context? • 2 Failure modes handled?                    |
| **High**   | All Medium checks + No rule contradiction? • Schema migration safety? • security\_checklist.md verified? |

### 3. Verdict Generation

After every task, write a verdict to `audit_log.md`:

* **PASS:** Proceed to `doc_sync`.
* **PASS-WITH-WARNING:** Proceed, but append a warning to `CHANGELOG.md` and `audit_log.md`.
* **FAIL:** Block the change. Fix and re-audit.

## Universal Quality Gate

You must confirm that the following commands return 0 errors:

1. `black` & `ruff` (Python)
2. `eslint` (JS/TS)
3. `mypy` & `tsc` (Type safety)

