# IDE and local setup

Tick each item and record the version. When everything is green, close the setup issue and log the session.

## 1. Base tools

| Tool | Check command | Version | ✓ |
|---|---|---|---|
| Git | `git --version` | 2.39.5 (Apple Git-154) | [x] |
| GitHub CLI | `gh --version` | 2.103.3 | [x] |
| GitHub CLI logged in | `gh auth status` | — | [x] |
| Node.js LTS | `node -v` | v24.22.2 | [x] |
| pnpm | `pnpm -v` (`corepack enable pnpm`) | 12.16.1 | [x] |
| Docker + Compose | `docker compose version` | Docker 28.1.1, Compose v2.35.1 | [x] |
| WSL (Windows only) | `wsl -l -v` → Ubuntu, version 2 | n/a (macOS) | — |

> On Windows, keep the repo **inside WSL** (`~/code/lifearchitect`), not under `C:\`. It's faster and avoids path and line-ending issues.

## 2. Claude Code

| Step | Check | ✓ |
|---|---|---|
| Install Claude Code | `claude --version` (2.1.312) | [x] |
| Log in with your Claude plan | run `claude`, follow login | [x] |
| Diagnostics clean | `claude doctor` (auto-update warning, see Notes) | [x] |
| Check usage display | inside Claude Code: `/usage` (subscription) or `/cost` (API) | [x] |

## 3. VS Code

| Step | ✓ |
|---|---|
| Install VS Code (1.135.0) | [x] |
| Install recommended extensions (VS Code prompts when you open the repo — `.vscode/extensions.json`) | [x] |
| Windows: open the repo via **WSL** extension (`code .` from WSL terminal) | n/a (macOS) |
| Claude Code extension panel opens and sees the repo | [x] |
| Integrated terminal: `claude` starts in the repo root | [x] |

## 4. Repository

| Step | Command | ✓ |
|---|---|---|
| Create public repo and push | `gh repo create lifearchitect --public --source=. --push` | [x] |
| Create labels, milestone, Phase 0 issues | `./scripts/bootstrap-github.sh` | [x] |
| Secret scanning + push protection on | GitHub → Settings → Code security | [x] |
| Branch protection on `main` (PR required, CI must pass) | GitHub → Settings → Branches | [x] |
| Project board created (Backlog → Ready → In Progress → In Review → Done) | GitHub → Projects | [x] |
| Board workflows on (item closed → Done, PR linked → In Review) | Project → Workflows | [x] |

## 5. Smoke test

- [ ] In Claude Code, run `/start-issue <setup issue number>` — agent reads the issue and creates a branch
- [ ] Make one small docs change, run `/finish-issue` — PR is opened, CI runs green
- [ ] Merge, confirm the issue closes and the card moves to **Done**
- [ ] Run `/log-session`

## Notes

Problems hit during setup and how they were solved (good build-log material):

- **Node 18.12.1 (end-of-life)** was installed from the nodejs.org pkg in `/usr/local`. Installed Node 24 LTS with `brew install node@24`. `/opt/homebrew/bin` comes first on PATH, so it takes precedence. Node 24 was chosen as the newest *mature* LTS. Node 26 had only just entered LTS.
- **pnpm missing**: `corepack enable pnpm` (corepack ships with Node 24).
- **`claude doctor` needs a TTY**: it fails with "Raw mode is not supported" when run from a non-interactive shell. Run it in a real terminal.
- **Claude Code auto-updates blocked**: npm-global install under `/usr/local` needs sudo, so the CLI is stuck on 1.0.108. Fixed with `claude migrate-installer`, which creates a local install in `~/.claude/local` (now 2.1.312). The installer's last step adds an alias. If you skip it, add `alias claude="$HOME/.claude/local/claude"` to `~/.zshrc` yourself, or `claude` keeps running the old npm-global copy.
- **`code` not on PATH** (macOS): VS Code command palette → "Shell Command: Install 'code' command in PATH".
