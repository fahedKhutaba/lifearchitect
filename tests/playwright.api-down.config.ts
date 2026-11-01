import { defineConfig, devices } from '@playwright/test';
import { CI, WEB_URL, webServer } from './support/servers.js';

// "API not reachable" run. Only the web app is started. The API is deliberately NOT started,
// so the browser gets a real network error (ECONNREFUSED). The spec checks this precondition.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: CI,
  retries: 0,
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'web-api-down',
      testMatch: /\/web\/home-api-down\.spec\.ts$/,
      use: { baseURL: WEB_URL, ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [webServer],
});
