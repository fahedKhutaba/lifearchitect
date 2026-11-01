import { expect, test } from '@playwright/test';
import { API_URL } from '../../support/servers.js';

// Runs in playwright.api-down.config.ts: only the web app is up, the API is not started.
// No request mocking: the browser really fails to reach the API.
test.describe('home page API status (API not reachable)', () => {
  test.beforeAll(async ({ playwright }) => {
    // Precondition: the API really is down, otherwise this test proves nothing.
    const api = await playwright.request.newContext();
    await expect(api.get(`${API_URL}/health`)).rejects.toThrow();
    await api.dispose();
  });

  test('shows "API: unreachable" when the API cannot be reached', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('API: unreachable', { exact: true })).toBeVisible();
    await expect(page.getByText('API: ok', { exact: true })).toHaveCount(0);
  });
});
