---
description: Start work on a GitHub issue — read it, branch, post a plan
argument-hint: <issue-number>
allowed-tools: Bash(gh issue view:*), Bash(gh issue comment:*), Bash(git checkout:*), Bash(git switch:*), Bash(git pull:*), Read, Glob, Grep
---

Start work on issue #$ARGUMENTS.

1. Read the issue: `gh issue view $ARGUMENTS --comments`.
2. If it links a spec in `specs/`, read the spec. Read relevant ADRs in `docs/adr/`.
3. Confirm the work is inside your agent's scope (`docs/agents/README.md`). If not, comment on the issue and stop.
4. Update `main` and create a branch: `git switch main && git pull && git switch -c <type>/$ARGUMENTS-<short-name>` (type = feat, fix, chore or docs).
5. Post a short plan as an issue comment (`gh issue comment`): files you will change, tests you will add, open questions.
6. If anything in the spec is unclear, ask in the comment and stop — do not guess.
