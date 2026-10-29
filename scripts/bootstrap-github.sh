#!/usr/bin/env bash
# Creates labels, the Phase 0 milestone and the Phase 0 issues in the current GitHub repo.
# Run once from the repo root, after `gh repo create ... --push`.
# Safe to re-run: labels are upserted; issues are skipped if a same-titled issue exists.
set -euo pipefail

command -v gh >/dev/null || { echo "gh CLI not found"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "Bootstrapping $REPO"

# ---------- Labels ----------
label() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null; echo "  label: $1"; }
echo "Labels"
label "agent:lead"     "5319e7" "Owned by the Lead"
label "agent:backend"  "1d76db" "Owned by the backend agent"
label "agent:frontend" "0e8a16" "Owned by the frontend agent"
label "agent:qa"       "fbca04" "Owned by the QA agent"
label "type:feature"   "a2eeef" "User-facing capability from a spec"
label "type:task"      "c5def5" "Setup, chore, docs, infra"
label "type:bug"       "d73a4a" "Does not match the spec"
label "phase-0"        "bfd4f2" "Phase 0: build the team"
label "v1"             "bfdadc" "Version 1: foundation"
label "blocked"        "b60205" "Waiting on a decision or another issue"

# ---------- Milestone ----------
MS="Phase 0 - Build the team"
if ! gh api "repos/$REPO/milestones?state=all" -q '.[].title' | grep -qxF "$MS"; then
  gh api "repos/$REPO/milestones" -f title="$MS" \
    -f description="Repo, tooling, agent team, logging, dry run" >/dev/null
  echo "Milestone created: $MS"
fi

# ---------- Issues ----------
issue() {
  local title="$1" labels="$2" body="$3"
  if gh issue list --state all --search "in:title \"$title\"" --json title -q '.[].title' | grep -qxF "$title"; then
    echo "  skip (exists): $title"; return
  fi
  gh issue create --title "$title" --label "$labels" --milestone "$MS" --body "$body" >/dev/null
  echo "  issue: $title"
}

echo "Issues"

issue "chore: set up IDE and local tooling" "agent:lead,type:task,phase-0" \
"## Goal
Working local environment: VS Code + Claude Code + GitHub CLI + Node + Docker.

## Definition of done
- [ ] Every row in \`docs/setup/ide-setup.md\` sections 1-3 ticked, with versions filled in
- [ ] Problems hit are written in the Notes section of that file
- [ ] Session logged with \`/log-session\`"

issue "chore: configure repository protections and project board" "agent:lead,type:task,phase-0" \
"## Goal
Make the GitHub lifecycle enforce the rules instead of relying on discipline.

## Definition of done
- [ ] \`docs/setup/ide-setup.md\` section 4 ticked
- [ ] Secret scanning + push protection enabled
- [ ] Branch protection on main: PR required, CI must pass
- [ ] Project board with columns Backlog / Ready / In Progress / In Review / Done and auto-move workflows
- [ ] \`@YOUR_GITHUB_USERNAME\` replaced in \`.github/CODEOWNERS\`"

issue "chore: start the activity log and weekly build log" "agent:lead,type:task,phase-0" \
"## Goal
Every working session leaves a trace; every week produces KPIs and one lesson.

## Definition of done
- [ ] \`/log-session\` used successfully at least once (row appended to \`docs/journal/activity-log.md\`)
- [ ] First weekly entry created from \`docs/journal/weekly/_template.md\` as \`weekly/build-log-01.md\`
- [ ] Usage reading (\`/usage\` or \`/cost\`) recorded in the log
- [ ] Private notes folder (\`private/\`, gitignored) created for anything not public"

issue "docs: ADR-0002 stack and ADR-0003 authentication" "agent:lead,type:task,phase-0" \
"## Goal
Record the two foundational decisions so every agent follows them.

## Definition of done
- [ ] ADR-0002: Next.js + NestJS + PostgreSQL + pnpm monorepo
- [ ] ADR-0003: authentication approach for V1
- [ ] Both use \`docs/adr/0000-template.md\`"

issue "chore: monorepo skeleton and contracts package" "agent:lead,type:task,phase-0" \
"## Goal
pnpm workspace with empty apps and a contracts package, so CI runs real lint/test steps.

## Definition of done
- [ ] Root \`package.json\` + \`pnpm-workspace.yaml\`
- [ ] \`apps/backend\` (NestJS), \`apps/web\` (Next.js) scaffolded, both build
- [ ] \`packages/contracts\` with an initial \`openapi.yaml\` (health endpoint only)
- [ ] CI green with Node steps running"

issue "chore: define the agent team" "agent:lead,type:task,phase-0" \
"## Goal
Agent definitions with explicit scopes, tools and models.

## Definition of done
- [ ] \`.claude/agents/backend.md\`, \`frontend.md\`, \`qa.md\` created
- [ ] Each lists owned paths, allowed tools, model and output format
- [ ] Scopes match \`docs/agents/README.md\`"

issue "feat: dry run - health check through the whole team" "agent:lead,type:feature,phase-0" \
"## Goal
Prove the full lifecycle with the smallest possible feature.

## Scope
Backend exposes \`GET /health\` per the contract; web shows API status; QA adds one API test and one e2e test.

## Definition of done
- [ ] Three PRs (backend, frontend, qa), each linked to a sub-issue
- [ ] CI green, QA verdict in each PR
- [ ] Usage and interventions logged
- [ ] Lessons written in the weekly build log"

echo "Done. Open the board: gh browse --projects  (or https://github.com/$REPO/issues)"
