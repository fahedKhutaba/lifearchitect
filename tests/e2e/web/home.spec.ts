import { expect, test } from '@playwright/test';

// Both apps are running (webServer). The web app calls the real API at http://localhost:3001.
test.describe('home page API status (API up)', () => {
  test('shows "API: ok" when the API is reachable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('API: ok', { exact: true })).toBeVisible();
  });

  test('shows "API: loading" while the health request is in flight', async ({ page }) => {
    // Hold the health request open so the loading state is observable.
    await page.route('http://localhost:3001/health', () => {
      /* never fulfil: the request stays in flight for the duration of the test */
    });
    await page.goto('/');
    await expect(page.getByText('API: loading', { exact: true })).toBeVisible();
    await expect(page.getByText('API: ok', { exact: true })).toHaveCount(0);
  });
});
