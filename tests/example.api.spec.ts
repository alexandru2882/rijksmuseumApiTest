import { test, expect } from '@playwright/test';

// API key from the assignment
const API_KEY = '0fiuZFh4';

test.describe('Rijksmuseum API Tests', () => {
    test('should get collection details', async ({ request }) => {
        const response = await request.get(`collection?key=${API_KEY}`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        expect(data).toBeDefined();
        expect(data.artObjects).toBeDefined();
        expect(Array.isArray(data.artObjects)).toBeTruthy();
        expect(data.count).toBeGreaterThan(0);
    });
});
