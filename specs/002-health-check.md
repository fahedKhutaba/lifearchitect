# Spec 002: Health check

- **Status:** Ready
- **Version:** V1 (Phase 0 dry run)
- **Issues:** #7 (backend #28, frontend #29, QA #30)

## Problem

The team (Lead, Backend, Frontend, QA) has not yet shipped anything end to end. This spec is the smallest possible feature that exercises the full lifecycle: contract → backend → web → tests → CI → merge. It also gives developers a quick way to see whether the web app can reach the API.

## User stories

- As a developer, I want the API to answer a liveness check so that I can tell the process is up.
- As a developer, I want the web app to show whether it can reach the API so that I can spot a broken setup at a glance.

## Acceptance criteria

### Backend

- [ ] Given the API is running, when a client sends `GET /health`, then it responds `200` with body `{"status":"ok"}` and `Content-Type: application/json`.
- [ ] The check is liveness only: it does not touch the database or any other dependency.
- [ ] The API listens on `PORT`, default `3001` (already in `main.ts`).
- [ ] CORS allows the web origin from `WEB_ORIGIN`, default `http://localhost:3000`, so the browser can call `/health`.

### Web

- [ ] The home page (`/`) shows an API status indicator.
- [ ] The status is fetched in the browser from `${NEXT_PUBLIC_API_URL}/health`, with `NEXT_PUBLIC_API_URL` defaulting to `http://localhost:3001`.
- [ ] Given the request is in flight, then the indicator shows **"API: loading"**.
- [ ] Given the response is `200` with `{"status":"ok"}`, then it shows **"API: ok"**.
- [ ] Given a network error, a non-`200` response, or an unexpected body, then it shows **"API: unreachable"**.
- [ ] The response type comes from the types generated from `packages/contracts` (not a hand-written type).

### QA

- [ ] API test: `GET /health` returns `200` and a body that matches the contract `Health` schema.
- [ ] E2E test (Playwright): with both apps running, `/` shows "API: ok".
- [ ] E2E test (Playwright): with the API not reachable, `/` shows "API: unreachable".
- [ ] Playwright starts both apps itself (`webServer`), so no Docker is needed.
- [ ] `tests/` runs with one command from the repo root.

## API / contract changes

None. `GET /health` and the `Health` schema already exist in [`packages/contracts/openapi.yaml`](../packages/contracts/openapi.yaml).

## UI

A single line of text on the home page, with three states: loading, ok, unreachable (see acceptance criteria). No styling requirements beyond readable text. Status is fetched once on page load; no polling or retry.

## Out of scope

- Database or dependency checks (readiness). Revisit when the API uses Postgres.
- Docker Compose and `infra/`. E2E switches to Compose with the first feature that needs the DB.
- Polling, retry, or a dedicated status page.
- Authentication.

## Delivery

| Sub-issue | Agent | Delivers |
|---|---|---|
| Backend (#28) | `agent:backend` | `GET /health`, CORS, unit test (Vitest) |
| Frontend (#29) | `agent:frontend` | Status indicator, component tests for the three states |
| QA (#30) | `agent:qa` | `tests/` package: API test, Playwright e2e, verdict on the backend and frontend PRs |
| CI | Lead | E2E job in `.github/workflows/ci.yml` once the QA tests exist |

## Open questions

None.
