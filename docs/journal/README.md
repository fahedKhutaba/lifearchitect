# Journal

Two levels of logging:

| File | When | What |
|---|---|---|
| [`activity-log.md`](activity-log.md) | End of **every working session** (`/log-session`) | One row per session: issue, agent, time, usage, outcome |
| [`weekly/`](weekly/) | **Once a week** | KPIs, lessons learned, next week — the source for the public build log |

## KPIs tracked

1. **Tasks done** — issues closed
2. **Usage** — tokens / plan usage % (`/cost` or `/usage` at session end)
3. **Interventions** — times the human had to correct or unblock an agent
4. **Defects caught** — bugs found by QA/CI before merge
5. **Defects escaped** — bugs found after merge

Derived: tokens per closed issue, rework rounds per PR, cycle time per issue.

## Rules

- Log facts, not feelings. A failed session is a valuable entry.
- No secrets, no personal data.
