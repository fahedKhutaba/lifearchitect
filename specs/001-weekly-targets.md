# Spec 001: Weekly targets and progress tracking

- **Status:** Draft — rules confirmed by the Lead on 2026-11-01; screenshots pending the prototype review (#23)
- **Version:** V1
- **Issues:** #25 (epic #20, contract #26)

## Problem

The user wants to set a few weekly targets (for example "Sport training — 5 hours per week"), log what they actually did during the week, and see at a glance whether they are on pace. V1 does only this; scope is in [`docs/product/v1-scope.md`](../docs/product/v1-scope.md).

## User stories

- As a user, I want to sign in so that my targets and progress are private to me.
- As a user, I want to create a weekly target with a name, unit and weekly amount so that I know what I am aiming for.
- As a user, I want to log a completed amount in one tap or with a date and note so that tracking takes seconds.
- As a user, I want to see this week's progress, pace and what is left per target so that I know where to focus.
- As a user, I want to see past weeks for a target so that I can tell whether I am improving.
- As a user, I want to pause or archive a target without losing its history.
- As a user, I want to set my timezone and week start day so that "this week" matches my real week.

## Domain rules

These rules apply to every screen and to the API. They are the source for the contract (#26) and for QA.

### Weeks

- **R1 — Week boundaries.** A week is 7 calendar days starting on the user's week start day (default **Sunday**) in the user's timezone (default the browser's timezone at first sign-in; changeable in Settings). Weeks are not stored; they are derived from entry dates.
- **R2 — Weekly progress** of a target = sum of `amount` of its entries whose `date` falls in that week. Progress is never stored as a counter.
- **R3 — Rollover.** Each week starts at zero. Earlier weeks stay as history.

### Targets

- **R4 — Fields.** `name` (1–60 chars, unique among the user's non-archived targets, case-insensitive), `unit` (`hours` | `minutes` | `times` | `km`), `weeklyAmount` (> 0, max 1000), `status` (`active` | `paused` | `archived`).
- **R5 — Unit is fixed** once the target has at least one entry. Name and weekly amount can always be edited.
- **R6 — Versioned amount and status.** A change to `weeklyAmount` or `status` takes effect from the **start of the current week** (`effectiveFrom` = current week start). Past weeks keep the amount and status they had. Several changes in the same week: the last one wins for that week.
- **R7 — Status transitions.** `active ↔ paused`; `active` or `paused` → `archived`; `archived` → `active` (restore). No hard delete in V1.
- **R8 — Visibility.** "This week" shows active and paused targets (paused shown muted, no pace, no quick log). Archived targets appear only in the Targets list under an "Archived" filter; their history stays readable.

### Progress entries

- **R9 — Fields.** `amount` (> 0, max 1000, in the target's unit), `date` (calendar day), `note` (optional, max 280 chars), `source` (`manual` only in V1).
- **R10 — Precision.** `hours`: steps of 0.25; `minutes` and `times`: whole numbers; `km`: steps of 0.1.
- **R11 — Allowed dates.** From **1 year before today** up to **today**. Future dates are rejected. Entries older than 1 year are read-only (cannot be edited or deleted). The UI shows the **last 4 weeks** by default (see screen 4); this is a display default, not a limit.
- **R12 — Logging targets.** Entries can be added only to active targets. Entries of paused or archived targets can still be edited or deleted within the R11 window.

### Pace and score

- **R13 — Days elapsed** = number of days of the current week up to and including today (1 on the first day, 7 on the last day). Today counts as elapsed.
- **R14 — Expected so far** = weeklyAmount × (days elapsed ÷ 7).
- **R15 — Pace status** (current week, active targets only):
  - `Done` if progress ≥ weeklyAmount;
  - otherwise `On track` if progress ≥ expected so far;
  - otherwise `Behind`.
  Because today counts (R13), a target with no progress on the first day is `Behind` (expected = 1/7 of the amount).
- **R16 — Remaining** = max(0, weeklyAmount − progress). **Per day** = remaining ÷ days left, where days left = 8 − days elapsed (today counts as a day left as well as elapsed: 7 on the first day, 1 on the last). Shown as e.g. "2 h left · ~30 min/day"; hidden when `Done`.
- **R17 — Exceeding.** Progress shows the real value (e.g. 6 / 5 h, bar full). For scoring, completion is capped at 100%.
- **R18 — Weekly score** for a week = simple average of capped completion of the targets that were **active in that week** (per R6). No active targets → no score (shown as "—", not 0%).
- **R19 — History.** Trend and history charts show the last 8 weeks including the current one, and judge each week against the amount and status in force that week (R6).

### Quick log

- **R20 — Quick-log buttons** add an entry dated today with the default amounts: hours **+30 min, +1 h**; minutes **+15, +30**; times **+1**; km **+1, +5**. After a quick log, a toast offers **Undo** for 5 seconds (undo deletes that entry).

### Ownership

- **R21** Every target, entry and setting belongs to one user. A user can never read or change another user's data; such requests behave as "not found" (per ADR-0003).

## Acceptance criteria

### 1. Sign in

- [ ] Given no session, when the user opens any app page, then they are redirected to `/sign-in`.
- [ ] Given valid credentials, when the user signs in, then they land on "This week".
- [ ] Given wrong credentials, then a single generic error is shown ("Email or password is incorrect") and no detail about which field was wrong.
- [ ] There is no sign-up link or page. Session, logout and throttling behaviour follow ADR-0003 and the auth spec.
- [ ] A "Sign out" action is available from the app header.

### 2. This week (home)

- [ ] Shows the week's date range in the header (e.g. "Sun 1 Nov – Sat 7 Nov").
- [ ] One card per active or paused target (R8), ordered by creation date.
- [ ] Each active card shows: name, progress "x / y unit", a progress bar, pace badge (R15), remaining and per-day line (R16), and quick-log buttons (R20).
- [ ] Given a quick log, then the card's progress, pace and the weekly score update without a page reload, and an Undo toast appears (R20).
- [ ] A "Log progress" action on each card opens the Log progress dialog (screen 5) with that target selected.
- [ ] A weekly score card shows the current week's score as a percentage (R18).
- [ ] A trend chart shows the weekly score for the last 8 weeks (R19).
- [ ] Empty state: no targets → message and a "Create your first target" button that opens the create form.
- [ ] Loading state shows skeleton cards; error state shows a message with "Retry".

### 3. Targets

- [ ] Lists the user's targets with name, unit, weekly amount and status; filter by status (default: active and paused).
- [ ] Create: form with name, unit, weekly amount; validation per R4; the new target appears in the list and on "This week".
- [ ] Edit: name and weekly amount always; unit only while the target has no entries (R5). Saving a new amount shows the note "Applies from this week" (R6).
- [ ] Row actions: Pause / Resume, Archive (with a confirm dialog), Restore (archived only) — per R7.
- [ ] Clicking a row opens Target detail.
- [ ] Empty state, loading and error states as on "This week".

### 4. Target detail

- [ ] Shows name, unit, current weekly amount, status, and this week's progress and pace (same as the card).
- [ ] Lists the entries of a selected week, newest date first, with amount, date and note. The week selector shows the current week and the 3 before it (last 4 weeks) by default; older weeks within the R11 window can be reached.
- [ ] Each entry inside the R11 window has Edit (opens screen 5 pre-filled) and Delete (with confirm). Older entries have no actions.
- [ ] A bar chart shows the last 8 weeks: actual per week against that week's amount (R19); exceeded weeks show the real value.
- [ ] Unknown or another user's target id → "Target not found" page with a link back to Targets.

### 5. Log progress dialog

- [ ] Fields: target (pre-selected when opened from a card or detail; only active targets selectable for new entries), amount, date (default today), note.
- [ ] Validation per R9–R12, with messages next to the field. The date picker disables dates outside the R11 window.
- [ ] The amount field accepts input in the target's unit and step (R10). For `hours`, the hint shows the value in minutes too (e.g. "1.25 h = 1 h 15 min").
- [ ] On save the dialog closes, a toast confirms, and all visible totals update.
- [ ] Same dialog is used for edit; in edit mode the target cannot be changed.
- [ ] On phone width the dialog is shown as a bottom drawer.

### 6. Settings

- [ ] Timezone: searchable list of IANA timezones, pre-set per R1.
- [ ] Week start day: any day of the week, default Sunday.
- [ ] On save a toast confirms, and "This week" uses the new values immediately. Changing them never changes stored entry dates.

### Cross-cutting

- [ ] All screens work at phone width (360 px) without horizontal scrolling.
- [ ] All amounts are formatted per unit (e.g. "1.5 h", "30 min", "3 times", "5 km"); sub-hour per-day values of an hours target read as minutes.
- [ ] Pace, remaining, score and history logic is covered by unit tests on both backend and web, including: first day of week, last day, exceeded target, mid-week amount change (R6), paused week excluded from score (R18), week start Sunday vs Monday, timezone where UTC date differs from local date.
- [ ] QA e2e covers: create target → quick log → pace changes → undo; log a past entry (allowed), a future entry (rejected) and an entry older than 1 year (rejected); user A cannot see user B's target.

## API / contract changes

To be written by the Lead in `packages/contracts/openapi.yaml` (#26). Expected resources:

- `targets` — list (filter by status), create, get, update (name, amount, status, unit while allowed). Responses include the amount and status **in force for the current week**.
- `entries` — list by target and date range, create, update, delete. Server enforces R9–R12.
- `weeks` — summary for a week (`/weeks/current` and by start date): per-target progress, expected, pace, remaining, per-day; weekly score. History for N weeks. **Pace and score are computed on the server** so web and mobile agree; the web keeps the same pure functions only for optimistic updates.
- `settings` — get, update (timezone, weekStartDay).
- Target versions (R6) are a storage detail; the contract exposes current values plus per-week values inside week summaries, not the version rows.

## UI

Screens and template mapping follow the scope doc and the component map on #23. Screenshots from the approved prototype go here once the Lead review on #23 is done:

<!-- screenshots: this-week, targets, target-detail, log-progress, settings, sign-in -->

## Out of scope

- Habits, schedules and routines
- Goals, milestones and tasks
- Sports watch integration (`source` other than `manual`, `externalId` use)
- Notifications and reminders
- Multiple entries per quick action, bulk import, CSV export
- Password reset, sign-up, profile editing (ADR-0003)
- Hard delete of targets; sharing targets between users
- AI features

## Open questions

Defaults below were chosen while drafting; the Lead confirms or changes them before the spec moves to **Ready**.

1. R4 limits: 60-char name, max weekly amount and entry amount of 1000.
2. R5: unit locked after the first entry (alternative: never editable after creation).
3. R11: entries older than 1 year are read-only, not just "cannot be created".
4. R20: Undo window of 5 seconds.
5. Screen 4: how older weeks (beyond the default 4) are reached, e.g. "Show earlier weeks" or a week picker.
