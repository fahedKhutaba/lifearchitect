import { resolve } from 'node:path';

// Shared web server definitions for the Playwright configs. Playwright starts them itself (no Docker).

export const ROOT = resolve(import.meta.dirname, '../..');
export const CI = !!process.env.CI;

export const API_URL = 'http://localhost:3001';
export const WEB_URL = 'http://localhost:3000';

/** API on PORT (default 3001), built and started by Nest. */
export const apiServer = {
  command: 'pnpm --filter @lifearchitect/backend start',
  cwd: ROOT,
  url: `${API_URL}/health`,
  env: { PORT: '3001' },
  reuseExistingServer: !CI,
  timeout: 120_000,
};

/**
 * Web app on 3000. NEXT_PUBLIC_API_URL is pinned explicitly so a value from the shell cannot change the test.
 * `next dev` is used because two Next instances cannot share apps/web (.next lock), so the
 * "API unreachable" scenario runs in its own Playwright config (playwright.api-down.config.ts).
 */
export const webServer = {
  command: 'pnpm --filter @lifearchitect/web exec next dev --port 3000',
  cwd: ROOT,
  url: WEB_URL,
  env: { NEXT_PUBLIC_API_URL: API_URL },
  reuseExistingServer: !CI,
  timeout: 120_000,
};
