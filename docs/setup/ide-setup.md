# IDE and local setup

Tick each item and record the version. When everything is green, close the setup issue and log the session.

## 1. Base tools

| Tool | Check command | Version | ✓ |
|---|---|---|---|
| Git | `git --version` | | [ ] |
| GitHub CLI | `gh --version` | | [ ] |
| GitHub CLI logged in | `gh auth status` | — | [ ] |
| Node.js LTS | `node -v` | | [ ] |
| pnpm | `pnpm -v` (`corepack enable pnpm`) | | [ ] |
| Docker + Compose | `docker compose version` | | [ ] |
| WSL (Windows only) | `wsl -l -v` → Ubuntu, version 2 | | [ ] |

> On Windows, keep the repo **inside WSL** (`~/code/lifearchitect`), not under `C:\`. It's faster and avoids path and line-ending issues.

## 2. Claude Code

| Step | Check | ✓ |
|---|---|---|
| Install Claude Code | `claude --version` | [ ] |
| Log in with your Claude plan | run `claude`, follow login | [ ] |
| Diagnostics clean | `claude doctor` | [ ] |
| Check usage display | inside Claude Code: `/usage` (subscription) or `/cost` (API) | [ ] |

## 3. VS Code

| Step | ✓ |
|---|---|
| Install VS Code | [ ] |
| Install recommended extensions (VS Code prompts when you open the repo — `.vscode/extensions.json`) | [ ] |
| Windows: open the repo via **WSL** extension (`code .` from WSL terminal) | [ ] |
| Claude Code extension panel opens and sees the repo | [ ] |
| Integrated terminal: `claude` starts in the repo root | [ ] |

## 4. Repository

| Step | Command | ✓ |
|---|---|---|
| Create public repo and push | `gh repo create lifearchitect --public --source=. --push` | [ ] |
| Create labels, milestone, Phase 0 issues | `./scripts/bootstrap-github.sh` | [ ] |
| Secret scanning + push protection on | GitHub → Settings → Code security | [ ] |
| Branch protection on `main` (PR required, CI must pass) | GitHub → Settings → Branches | [ ] |
| Project board created (Backlog → Ready → In Progress → In Review → Done) | GitHub → Projects | [ ] |
| Board workflows on (item closed → Done, PR linked → In Review) | Project → Workflows | [ ] |

## 5. Smoke test

- [ ] In Claude Code, run `/start-issue <setup issue number>` — agent reads the issue and creates a branch
- [ ] Make one small docs change, run `/finish-issue` — PR is opened, CI runs green
- [ ] Merge, confirm the issue closes and the card moves to **Done**
- [ ] Run `/log-session`

## Notes

Problems hit during setup and how they were solved (good build-log material):

-
