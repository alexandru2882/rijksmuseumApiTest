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

  test('supports pagination with different pages', async ({ request }) => {
    if (!hasApiKey()) test.skip(true, 'RIJKS_API_KEY not set; skipping live API test');

    const params = { q: 'portrait', ps: 5 };
    const page1Url = buildUrl('collection', { ...params, p: 1 });
    const page2Url = buildUrl('collection', { ...params, p: 2 });

    const [r1, r2] = await Promise.all([request.get(page1Url), request.get(page2Url)]);
    expect(r1.ok()).toBeTruthy();
    expect(r2.ok()).toBeTruthy();

    const j1 = await r1.json();
    const j2 = await r2.json();
    expect(Array.isArray(j1.artObjects)).toBe(true);
    expect(Array.isArray(j2.artObjects)).toBe(true);
    expect(j1.artObjects.length).toBeGreaterThan(0);
    expect(j2.artObjects.length).toBeGreaterThan(0);

    const ids1 = new Set(j1.artObjects.map((o: any) => o.objectNumber));
    const overlap = j2.artObjects.some((o: any) => ids1.has(o.objectNumber));
    expect(overlap).toBeFalsy();
  });

  test('returns error without API key', async ({ request }) => {
    const url = buildUrl('collection', { q: 'still life', ps: 1 }, { includeKey: false });
    const resp = await request.get(url);
    expect(resp.ok()).toBeFalsy();
    expect([401, 403, 400]).toContain(resp.status());
  });
});
