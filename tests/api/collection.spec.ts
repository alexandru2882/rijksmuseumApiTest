import { test, expect } from '@playwright/test';
import { buildUrl, hasApiKey } from '../../src/rijksClient';

test.describe('Rijksmuseum API', () => {
  test('search collection returns results', async ({ request }) => {
    if (!hasApiKey()) test.skip(true, 'RIJKS_API_KEY not set; skipping live API test');

    const url = buildUrl('collection', { q: 'rembrandt', ps: 5 });
    const resp = await request.get(url, { timeout: 20000 });
    expect(resp.ok()).toBeTruthy();

    const json = await resp.json();
    expect(json).toHaveProperty('count');
    expect(Array.isArray(json.artObjects)).toBe(true);
    expect(json.artObjects.length).toBeGreaterThan(0);
  });

  test('single art object detail can be retrieved', async ({ request }) => {
    if (!hasApiKey()) test.skip(true, 'RIJKS_API_KEY not set; skipping live API test');

    const searchUrl = buildUrl('collection', { q: 'vermeer', ps: 1 });
    const searchResp = await request.get(searchUrl);
    expect(searchResp.ok()).toBeTruthy();
    const search = await searchResp.json();
    const first = search.artObjects?.[0];
    expect(first).toBeTruthy();

    const objectNumber = first.objectNumber as string;
    const detailUrl = buildUrl(`collection/${objectNumber}`);
    const detailResp = await request.get(detailUrl);
    expect(detailResp.ok()).toBeTruthy();

    const detail = await detailResp.json();
    expect(detail).toHaveProperty('artObject');
    expect(detail.artObject).toHaveProperty('title');
  });
});
