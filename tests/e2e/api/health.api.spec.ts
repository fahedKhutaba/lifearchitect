import { expect, test } from '@playwright/test';
import { validateHealth } from '../../support/contract.js';

test.describe('GET /health', () => {
  test('returns 200, JSON, and a body that matches the contract Health schema', async ({ request }) => {
    const res = await request.get('/health');

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/^application\/json\b/);

    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
    expect(validateHealth(body), JSON.stringify(validateHealth.errors)).toBe(true);
  });

  test('contract check rejects extra properties (guards against a vacuous validator)', () => {
    expect(validateHealth({ status: 'ok', extra: true })).toBe(false);
    expect(validateHealth({ status: 'down' })).toBe(false);
    expect(validateHealth({})).toBe(false);
  });
});
