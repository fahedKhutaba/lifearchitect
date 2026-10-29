# LifeArchitect

> An AI-native personal operating system — built by an AI-native engineering team.

LifeArchitect helps people define goals, break them into plans, track execution and keep improving across every area of life. Not a habit tracker, not a task manager, not a notes app: a **personal architect + coach + memory + planning system**.

This repository is also an open experiment: the product is designed and built by a **team of Claude Code agents** (backend, frontend, QA) orchestrated by a human architect, using **spec-driven development**. Every decision, cost and lesson is documented in the open.

---

## Roadmap

| Version | Focus | Highlights |
|---|---|---|
| **V1** | Foundation | Goals, milestones, tasks, dashboard. No AI. |
| **V2** | AI Goal Assistant | Goal decomposition, plans, progress insights (Claude API) |
| **V3** | Knowledge | Notes, documents, search, RAG, MCP server |
| **V4** | Coaching | Specialized coaching agents and multi-agent workflows |

Details: [`docs/roadmap.md`](docs/roadmap.md) · Vision: [`docs/vision.md`](docs/vision.md)

## How it is built

```text
spec (specs/)  →  issue (GitHub)  →  agent implements  →  PR + CI  →  QA agent  →  merge
```

| Agent | Owns | Never touches |
|---|---|---|
| **Lead** (human + main session) | Specs, contracts, issues, merges | Feature code |
| **Backend** | `apps/backend`, migrations, `docker-compose` | `apps/web` |
| **Frontend** | `apps/web` | Backend, contracts |
| **QA** | `tests/`, e2e | Production code (reports, doesn't fix) |

Team rules: [`docs/agents/README.md`](docs/agents/README.md) · Agent instructions: [`CLAUDE.md`](CLAUDE.md)

## Tech stack

Next.js · TypeScript · Tailwind · NestJS · PostgreSQL · Claude API · Docker Compose

Decisions are recorded as ADRs in [`docs/adr/`](docs/adr/).

## Repository layout

```text
lifearchitect/
├── apps/
│   ├── web/              # Next.js frontend
│   └── backend/          # NestJS API
├── packages/
│   └── contracts/        # OpenAPI spec + shared types — the contract between agents
├── specs/                # One spec per feature (spec-driven development)
├── docs/
│   ├── vision.md
│   ├── roadmap.md
│   ├── architecture/
│   ├── adr/              # Architecture Decision Records
│   ├── agents/           # Agent team, scopes, rules
│   ├── journal/          # Activity log + weekly build log
│   └── setup/            # Developer / IDE setup
├── infra/                # Docker Compose, later k3s
├── .claude/              # Agent definitions + slash commands
└── .github/              # Issue/PR templates, CI
```

## Build log

Progress, KPIs (tasks done, tokens, interventions, defects caught) and lessons learned:
[`docs/journal/`](docs/journal/)

## Getting started

See [`docs/setup/ide-setup.md`](docs/setup/ide-setup.md).

## License

[MIT](LICENSE)
