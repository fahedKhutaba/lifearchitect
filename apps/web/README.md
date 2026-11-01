# Web

Next.js app for LifeArchitect. Owned by the Frontend agent ([`.claude/agents/frontend.md`](../../.claude/agents/frontend.md)). Stack: [ADR-0002](../../docs/adr/0002-stack.md).

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |

API types come from `@lifearchitect/contracts`. Read `AGENTS.md` before writing Next.js code.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Base URL of the API. The home page calls `${NEXT_PUBLIC_API_URL}/health` from the browser to show the API status. Read at build time. |
