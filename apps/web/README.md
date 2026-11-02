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

## Template and attribution

The UI foundation comes from [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) (MIT, imported at commit `00ed72e`). Its license is kept in [`LICENSE-next-shadcn-dashboard-starter`](LICENSE-next-shadcn-dashboard-starter). Clerk, Sentry, the demo pages and the template's other themes were removed. Auth stays per ADR-0003. Spike notes: issue #23.

- `src/components/ui`: shadcn/ui primitives on Base UI (not Radix)
- `src/components/data-table`, `src/lib/data-table-*`, `src/hooks/use-data-table.ts`: TanStack Table v9 data table
- `src/components/forms`, `src/lib/form*.ts`: TanStack Form field components
- `src/components/layout`: sidebar, header, page container
- Template code keeps its own style (single quotes). ESLint is the repo's linter; no formatter is configured yet.
- Fake data, when needed, lives only in `src/mocks`.
