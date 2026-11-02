# V1 Scope — Weekly Targets & Progress Tracking

Status: Draft (input for spec definition)
Date: 2026-11-01

## Focus

V1 does one thing well: **set weekly targets and track progress against them.**

Example: "Sport training — 5 hours per week." During the week the user logs completed amounts (e.g. 1 hour), and the app shows progress, pace and history.

## In scope

- Sign in (login only, per ADR-0003: accounts created by admin command, no sign-up)
- Create, edit, pause and archive weekly targets
- Log progress entries manually (add, edit, delete)
- "This week" home screen with progress, pace status and quick logging
- Per-target history (entries and weekly chart)
- Settings: timezone and week start day

## Out of scope (V1)

- Habits and scheduled routines
- Goals → milestones → tasks (moved to a later version; update `docs/roadmap.md`)
- Sports watch integration (Garmin, etc.)
- Notifications and reminders
- AI features

## Domain model

### Target

| Field | Notes |
|---|---|
| id | |
| name | e.g. "Sport training" |
| unit | `hours` \| `minutes` \| `times` \| `km` |
| weeklyAmount | e.g. 5 |
| status | `active` \| `paused` \| `archived` |
| createdAt | |

### Progress entry

| Field | Notes |
|---|---|
| id | |
| targetId | |
| amount | in the target's unit |
| date | the day the activity happened |
| note | optional |
| source | `manual` only in V1; `garmin` etc. later |
| externalId | empty in V1; used later to avoid importing the same activity twice |
| createdAt | |

### Week

Not stored. Derived from the entry date, the user's timezone and the user's week start day (default: Sunday).

**Weekly progress = sum of the target's entries whose date falls in that week.**

Design principle: progress is a list of entries, never a stored counter. This gives history and charts for free, makes corrections simple, and lets a future integration add entries with a different `source` without changing the model.

## Smart tracking

- **Pace status** — compare progress with the expected amount by today.
  Expected = weeklyAmount × (days elapsed in week ÷ 7).
  Status: `On track` / `Behind` / `Done`.
- **Remaining** — amount left and suggested amount per remaining day
  (e.g. "2 h left · ~30 min/day").
- **Quick log** — one-tap buttons on each target card (e.g. +30 min, +1 h), defaults per unit.
- **Trend** — last 8 weeks, actual vs target.
- **Weekly score** — average completion of all active targets, each capped at 100%.

## Screens and template mapping

Base: next-shadcn-dashboard-starter. Rule: reuse template components first; build custom only when the spec requires it, and justify it in the PR.

| # | Screen | Content | Template piece |
|---|---|---|---|
| 1 | Sign in | Email + password login (ADR-0003) | Auth page layout only — remove the template's Clerk integration |
| 2 | Home — "This week" | Card per target: progress bar, pace status, quick-log buttons; weekly score; trend chart | Overview dashboard: stat cards, charts |
| 3 | Targets | List with create / edit / pause / archive | Data table + form pages |
| 4 | Target detail | This week's entries (edit / delete); weekly history chart | Detail layout + chart |
| 5 | Log progress | Amount, date (default today), note | Dialog / sheet |
| 6 | Settings | Timezone, week start day | Profile / settings page |

## Rules to confirm in the spec

Confirmed by the Lead on 2026-11-01 as suggested below; the binding wording is in [`specs/001-weekly-targets.md`](../../specs/001-weekly-targets.md) (rules R1–R21). Lead changes on 2026-11-02: pace counts today as an elapsed day, and logging for past weeks is allowed up to 1 year back (the UI shows the last 4 weeks by default).

1. **Changing a target's weekly amount mid-week** — *Suggested:* applies from the current week; past weeks keep the amount they had (store target changes with an `effectiveFrom` date).
2. **Logging for past weeks** — allowed, or current week only? *Suggested:* allow, limited to the last 4 weeks.
3. **Exceeding a target** — *Suggested:* show the real value (e.g. 6/5 h) but cap the score contribution at 100%.
4. **Paused targets** — *Suggested:* excluded from the weekly score while paused.
5. **Weekly score formula** — *Suggested:* simple average of active targets' capped completion.
6. **Week rollover** — *Suggested:* each week starts at zero; previous weeks remain as history.

## Future (not V1)

- **Sports watch integration** — entries arrive with `source = garmin` and an `externalId` for de-duplication; activity types map to targets. Needs its own ADR.
- Habits with schedules contributing to targets.
- Goals → milestones → tasks, with targets optionally linked to goals.
- AI: suggestions for realistic targets, weekly reflections.

## Next steps

1. ADR-0004: adopt next-shadcn-dashboard-starter for `apps/web` (strip Clerk, Sentry and demo pages; auth stays per ADR-0003).
2. Spike: clickable prototype of the six screens with mock data (in `apps/web`, behind a mock data layer).
3. Product owner reviews the prototype and confirms the rules above.
4. Spec agent drafts `specs/001-weekly-targets.md` (from `specs/000-template.md`) with Playwright screenshots.
5. Lead writes the OpenAPI contract from the approved spec.
6. Backend, frontend and QA implement against the contract.
