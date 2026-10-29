# CLAUDE.md — LifeArchitect

Instructions for every Claude Code agent working in this repo. Keep this file short: it is loaded into every agent's context.

## Project

AI-native personal operating system: goals → milestones → tasks → dashboard. Current version: **V1 (no AI features)**.

## Stack

- Web: Next.js, React, TypeScript, Tailwind (`apps/web`)
- Backend: NestJS, TypeScript (`apps/backend`)
- DB: PostgreSQL
- Contract: OpenAPI in `packages/contracts` — the single source of truth between backend and frontend
- Runtime: Docker Compose (`infra/`)

## Workflow (spec-driven)

1. Every task starts from a GitHub issue. No issue → no work.
2. Every feature issue links a spec in `specs/`. Implement only what the spec says; if unclear, **comment on the issue and stop** — never invent requirements.
3. Branch: `feat/<issue>-<short-name>` (or `fix/`, `chore/`, `docs/`).
4. PR title references the issue; PR body contains `Closes #<issue>`.
5. CI must be green. QA review is required before merge.
6. Only the Lead changes `packages/contracts`. If you need a contract change, request it on the issue.

## Scopes

Stay inside your agent's scope (see `docs/agents/README.md`). Do not edit files owned by another agent.

## Definition of done

- Acceptance criteria from the spec are met
- Tests added/updated and passing
- No secrets, no real personal data (seed data must be fake)
- Docs updated if behavior or decisions changed (ADR for architectural decisions)

## Logging

At the end of each session, run `/log-session` to append an entry to `docs/journal/activity-log.md`.

## Never

- Commit `.env` files, keys or tokens
- Push directly to `main`
- Disable tests to make CI pass
