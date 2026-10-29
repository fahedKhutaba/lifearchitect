---
description: Finish the current issue — verify, commit, open a PR
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(pnpm:*), Read
---

Finish work on the current branch.

1. Find the issue number from the branch name.
2. If `package.json` exists, run `pnpm lint` and `pnpm test` (Turborepo; generates contract types first). Fix failures inside your scope; never disable tests.
3. Check `git status` and `git diff`: no secrets, no `.env`, no files outside your scope.
4. Commit with a conventional message (`feat: …`, `fix: …`, `docs: …`, `chore: …`) and push.
5. Open a PR with `gh pr create`, filling `.github/pull_request_template.md`. The body must contain `Closes #<issue>`.
6. Report the PR link and run `/log-session`.
