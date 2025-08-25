import { test, expect } from '@playwright/test';

test.describe('Rijksmuseum API Tests', () => {
    test('should get collection details', async ({ request }) => {
        // You'll need to add your API key here
        const response = await request.get(`collection?key=${process.env.RIJKSMUSEUM_API_KEY}`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toBeDefined();
    });
});
