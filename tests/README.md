# Tests

Cross-app tests for LifeArchitect: API checks and Playwright end-to-end tests. Owned by the QA agent ([`.claude/agents/qa.md`](../.claude/agents/qa.md)). Stack: [ADR-0002](../docs/adr/0002-stack.md) (Playwright for e2e).

## Run

From the repo root:

```sh
pnpm install
pnpm --filter @lifearchitect/tests exec playwright install chromium   # first time only, downloads the browser
pnpm test:e2e
```

`pnpm test:e2e` starts the apps itself (no Docker):

| App | Port | How |
|---|---|---|
| API (`apps/backend`) | 3001 | `pnpm --filter @lifearchitect/backend start` (`PORT=3001`) |
| Web (`apps/web`) | 3000 | `next dev --port 3000`, `NEXT_PUBLIC_API_URL=http://localhost:3001` |

The run has two Playwright passes, because the "API unreachable" case needs the API to be down:

1. `playwright.config.ts`: API tests (`e2e/api`) and home page with the API up (`e2e/web/home.spec.ts`).
2. `playwright.api-down.config.ts`: home page with only the web app up (`e2e/web/home-api-down.spec.ts`). The test first checks that `http://localhost:3001/health` really refuses connections.

Ports 3000 and 3001 must be free for a clean run. Locally, a web or API server already running on those ports is reused (`reuseExistingServer`). In CI nothing is reused. If the API is up during the second pass, its precondition check fails, so a reused API cannot hide a wrong result.

## Scripts

| Script | What it does | Used by CI |
|---|---|---|
| `pnpm test:e2e` (root) | Runs `e2e` in this package | Lead adds the CI job |
| `e2e` | Both Playwright passes | yes |

This package has **no** `test`, `lint` or `build` script. Those would need browsers or running servers, so root `pnpm test`, `pnpm lint` and `pnpm build` do not run these tests.

## Layout

| Path | Contents |
|---|---|
| `support/servers.ts` | Web server definitions for both configs |
| `support/contract.ts` | Loads the `Health` schema from `packages/contracts/openapi.yaml` and compiles it with Ajv. The contract is read only. |
| `e2e/api/` | API tests (Playwright `request` fixture) |
| `e2e/web/` | Browser tests for the home page |

## Notes

- Tests use `localhost`, not `127.0.0.1`. The API allows the web origin `http://localhost:3000` by default (CORS, `WEB_ORIGIN`), so the origins must match.
- The "loading" test holds the health request open with `page.route`. This is the only route interception in the suite, and it is needed to observe the in-flight state.
- Reports and traces go to `test-results/` (gitignored). Failure traces can be opened with `pnpm exec playwright show-trace <file>` from `tests/`.
