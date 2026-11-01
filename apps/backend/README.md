# Backend

NestJS API for LifeArchitect. Owned by the Backend agent ([`.claude/agents/backend.md`](../../.claude/agents/backend.md)). Stack: [ADR-0002](../../docs/adr/0002-stack.md).

| Command | What it does |
|---|---|
| `pnpm start:dev` | Run with watch on `PORT` (default 3001) |
| `pnpm build` | Compile to `dist/` |
| `pnpm lint` | oxlint |
| `pnpm test` | Vitest |

API types come from `@lifearchitect/contracts`.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3001` | Port the API listens on |
| `WEB_ORIGIN` | `http://localhost:3000` | Origin allowed by CORS |

## Endpoints

- `GET /health`: liveness, returns `200 {"status":"ok"}`. No dependencies checked.
