# Activity log

Append one row per working session (newest at the bottom). Use `/log-session` in Claude Code, or add it by hand.

## Columns

- **Date** — YYYY-MM-DD
- **Issue** — `#n` or `—`
- **Agent(s)** — lead / backend / frontend / qa
- **Model** — main model used
- **Time** — minutes of active session
- **Usage** — tokens or plan-usage % from `/cost` / `/usage`
- **Outcome** — done / partial / blocked / failed
- **Interv.** — number of human interventions
- **Note** — one line: what happened or what was learned

## Log

| Date | Issue | Agent(s) | Model | Time | Usage | Outcome | Interv. | Note |
|---|---|---|---|---|---|---|---|---|
| 2026-10-29 | — | lead | — | — | — | done | 0 | Repo skeleton, README, GitHub kit, journal created |
| 2026-10-29 | #1 | lead | claude-opus-5-5 | ~20 | 6% session / 3% weekly (Pro) | done | 3 | Old Node and Claude installs only showed up once versions were checked; installer migration and shell alias need a human (blocked for the agent) |
| 2026-10-29 | #2 | lead | claude-opus-5-5 | ~20 | ~10% session / ~4% weekly (Pro) | done | 3 | Repo settings applied via `gh api`; board view and built-in workflows are UI-only, and `project` token scope had to be granted by the user |
| 2026-10-29 | #3 | lead | claude-opus-5-5 | ~25 | 12% session / 4% weekly (Pro, cumulative) | partial | 1 | Weekly entry deferred to Friday; added a scheduled Action that opens the weekly issue (tested via manual run → #15) |
| 2026-10-29 | #4 | lead | claude-opus-5-5 | ~40 | 12% session / 4% weekly (Pro, cumulative) | done | 2 | Issue left stack details and auth open; asking first prevented guessing; simplified auth to login-only with admin-created accounts. /start-issue = 27% of usage → try a cheaper model |
| 2026-10-29 | #6 | lead | claude-opus-5-5 | ~12 | 5% weekly (Pro, cumulative, read 2026-10-30; session window had reset) | done | 2 | Path restrictions can't be enforced via `tools`; chose instructions + review + a "Scope violations" KPI over a hook. `/agents` wizard is gone, so check agents via the main session |
| 2026-10-29 | #5 | lead | claude-opus-5-5 | ~15 | 5% weekly (Pro, cumulative, read 2026-10-30; session window had reset) | done | 1 | Scaffolds ship vendor `AGENTS.md` files (one was a telemetry promo, removed); TS 7 breaks `openapi-typescript` (pinned 5.9); `pnpm -r` skips codegen, so use Turborepo |
