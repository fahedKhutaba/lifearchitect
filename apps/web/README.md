# Web

Next.js app for LifeArchitect. Owned by the Frontend agent ([`.claude/agents/frontend.md`](../../.claude/agents/frontend.md)). Stack: [ADR-0002](../../docs/adr/0002-stack.md).

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |

API types come from `@lifearchitect/contracts`. Read `AGENTS.md` before writing Next.js code.
