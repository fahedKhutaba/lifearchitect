# Agent team

Build-time agents (Claude Code) that engineer LifeArchitect. These are **not** product features — the product's own coaching agents (V4) live under `docs/` product specs.

## Roles and scopes

| Agent | Owns (writes) | Reads only | Never |
|---|---|---|---|
| **Lead** (human + main session) | `specs/`, `packages/contracts`, issues, merges | Everything | Writes feature code |
| **Backend** | `apps/backend`, DB migrations, `infra/docker-compose*` | `packages/contracts`, `docs/`, `specs/` | `apps/web` |
| **Frontend** | `apps/web` | `packages/contracts`, `docs/`, `specs/` | Backend, contracts |
| **QA** | `tests/`, e2e tests | Everything | Fixing production code — it reports defects, owners fix |
| **DevOps** | _Deferred until k3s_ | — | — |

Agent definitions (scope, tools, model, output format):

- [`backend.md`](../../.claude/agents/backend.md): model `sonnet`
- [`frontend.md`](../../.claude/agents/frontend.md): model `sonnet`
- [`qa.md`](../../.claude/agents/qa.md): model `haiku` (move to `sonnet` if it misses defects)

### Running an agent

- From the main session: _"Use the backend agent to work on issue #12"_. Claude Code delegates to that agent.
- Directly: `claude --agent backend`, then `/start-issue 12`.
- Check they load: ask the main session which agent types it can use. `backend`, `frontend` and `qa` should be listed. The `/agents` wizard has been removed, so edit the files directly.

Scope is enforced by the agent instructions, CODEOWNERS and QA review, not by tooling. Every edit outside scope is counted as a **scope violation** in the weekly build log. The first violation is the trigger to add a path-guard hook.

## Rules

1. One issue = one agent = one branch = one PR.
2. Only the Lead changes the contract.
3. QA approval + green CI before merge.
4. Blocked or unclear → comment on the issue, don't guess.
5. Agents don't inherit each other's context: everything shared lives in files (spec, contract, ADR, CLAUDE.md).

## Model choice

- Lead: strongest model
- Backend / Frontend: default model
- QA / reviews: smaller model where quality allows (cost lever)
