# ADR-0002: Technology stack and monorepo

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Lead

## Context

LifeArchitect V1 is a responsive web app (goals, milestones, tasks, dashboard) built by several AI agents working in parallel on separate scopes (`apps/web`, `apps/backend`, `tests/`). The agents share no conversation history, so the stack must be conventional, well documented, and fixed in writing. A mobile app (React Native) and AI features come later and must not require a rewrite.

## Decision

A TypeScript monorepo:

| Area | Choice |
|---|---|
| Runtime | Node.js **24 LTS**, pinned in `.nvmrc` and `engines` |
| Package manager / workspaces | **pnpm** workspaces |
| Task runner | **Turborepo** (task ordering, local and CI caching) |
| Web | **Next.js** + React + TypeScript + Tailwind, in `apps/web` |
| Backend | **NestJS** + TypeScript, in `apps/backend` |
| Database | **PostgreSQL** |
| DB access and migrations | **Prisma** (schema and migrations owned by Backend) |
| API contract | **Contract-first OpenAPI** in `packages/contracts` |
| Unit / integration tests | **Vitest** (NestJS via the SWC plugin for decorators) |
| End-to-end tests | **Playwright** |
| Local runtime | **Docker Compose** in `infra/` |

Contract-first means:

1. The Lead edits `packages/contracts/openapi.yaml` by hand. It is the single source of truth.
2. TypeScript types are generated from it (`openapi-typescript`) and imported by both web and backend.
3. In V1 the contract is enforced by these shared types and by tests. Full runtime request validation against the spec is not required.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| Contract-first OpenAPI (chosen) | Enforces "only the Lead changes the contract"; web and backend can work in parallel | Spec is written by hand; generated types must be kept up to date |
| Code-first (`@nestjs/swagger` generates the spec) | Less hand-written YAML | The backend agent effectively owns the contract; web waits on backend |
| pnpm + Turborepo (chosen) | Correct task order across packages, caching speeds up the frequent agent lint/test runs | One more config file |
| pnpm workspaces only | Simplest | No caching; task ordering by hand |
| Prisma (chosen) | Typed client, built-in migrations, widely known to agents | Extra generate step; less control over raw SQL |
| Drizzle | Light, SQL-like | Fewer examples, so agents make more mistakes |
| TypeORM | NestJS default | Weaker typing, decorator-heavy entities |
| Vitest (chosen) | Fast, one runner for web and backend | NestJS assumes Jest and needs the SWC plugin |
| Jest | NestJS default | Slower; two runners in the repo |

## Consequences

- Every package uses Node 24 and pnpm. CI reads the Node version from `.nvmrc` instead of `lts/*`.
- A contract change is a Lead PR to `packages/contracts` first. Web and backend PRs follow and use the regenerated types.
- The Backend agent owns `prisma/schema.prisma` and migrations. Schema changes need a migration in the same PR.
- New tooling (another ORM, test runner, or framework) requires a new ADR that supersedes this one.
- Watch: Prisma and Vitest with NestJS need some initial setup (#5). If it costs more than expected, record it in the build log.
