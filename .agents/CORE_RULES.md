# Agent Constitution: Core Rules 0-10

## Rule 0: The Context Budget

* Max 2 skill files loaded per task.
* Every session must begin by reading `issue_log.md` (last 10 entries).

## Rule 1: Contract-First Development

* No logic implementation before interfaces are defined in `.agent/contracts/`.
* Any change to a schema requires an immediate `quality_auditor` check.

## Rule 2: Strict Type Safety

* `any` is forbidden. Use `unknown` or explicit interfaces.
* All API responses must be wrapped in a Result type `{ data: T; error: string | null }`.

## Rule 3: Async-First (No Sync IO)

* Absolutely no synchronous File System or Network IO in async contexts.
* Use `fs/promises` and non-blocking drivers.

## Rule 4: Atomic UI Components

* Components must not exceed 100 lines.
* Business logic stays in Server Actions/Hooks; UI stays in components.

## Rule 5: The "No-Print" Policy

* Use structured logging. `console.log` is a "Fail" in the Quality Gate.

## Rule 6: Error Boundaries

* Every feature must have a defined "Failure Mode."
* Use `try-catch` blocks that log to `issue_log.md` on failure.

## Rule 7: Secure Defaults

* Env variables must be validated via Zod/Pydantic.
* PII must never be written to `audit_log.md`.

## Rule 8: Dependency Minimalization

* Prefer native Web APIs over adding small npm/pip packages.

## Rule 9: Document Sync

* Every "Pass" verdict must update `README.md` or `ARCHITECTURE.md`.

## Rule 10: Self-Healing Trigger

* If an error recurs >= 2 times in `issue_log.md`, invoke `self_healer` to patch the skill.

