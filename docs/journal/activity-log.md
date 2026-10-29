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
