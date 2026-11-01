import { defineConfig, devices } from '@playwright/test';
import { API_URL, CI, WEB_URL, apiServer, webServer } from './support/servers.js';

// Main run: API up, web up. The "API unreachable" run lives in playwright.api-down.config.ts.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: 0,
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: /\/api\/.*\.spec\.ts$/,
      use: { baseURL: API_URL },
    },
    {
      name: 'web',
      testMatch: /\/web\/home\.spec\.ts$/,
      use: { baseURL: WEB_URL, ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [apiServer, webServer],
});
