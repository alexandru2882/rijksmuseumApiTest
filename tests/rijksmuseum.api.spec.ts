import { test, expect } from '@playwright/test';

// API key from environment variable
const API_KEY = process.env.API_KEY;
test.describe('Rijksmuseum API Assignment Tests', () => {

  test.describe('Collection Retrieval Tests', () => {

    test('should retrieve collections with valid API key', async ({ request }) => {
      const response = await request.get(`collection?key=${API_KEY}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.artObjects).toBeDefined();
      expect(Array.isArray(data.artObjects)).toBeTruthy();
      expect(data.count).toBeGreaterThan(0);
    });

    test('should retrieve collections with pagination', async ({ request }) => {
      const response = await request.get(`collection?key=${API_KEY}&p=1&ps=10`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      expect(data.artObjects.length).toBeLessThanOrEqual(10);
      // Note: The API doesn't return page and pageSize fields in the response
      // The pagination parameters are handled but not echoed back
    });

    test('should retrieve collections with search query', async ({ request }) => {
      const searchQuery = 'Rembrandt';
      const response = await request.get(`collection?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      expect(data.artObjects.length).toBeGreaterThan(0);

      // Verify search results contain the search term
      const hasSearchResults = data.artObjects.some((artObject: any) =>
        artObject.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artObject.principalOrFirstMaker?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      expect(hasSearchResults).toBeTruthy();
    });

    test('should retrieve collections with artist filter', async ({ request }) => {
      const artist = 'Rembrandt van Rijn';
      const response = await request.get(`collection?key=${API_KEY}&involvedMaker=${encodeURIComponent(artist)}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      expect(data.artObjects.length).toBeGreaterThan(0);

      // Verify all results are by the specified artist
      const allByArtist = data.artObjects.every((artObject: any) =>
        artObject.principalOrFirstMaker === artist
      );
      expect(allByArtist).toBeTruthy();
    });

    test('should retrieve collections with date range filter', async ({ request }) => {
      // Test single period filter (17th century)
      const response = await request.get(`collection?key=${API_KEY}&f.dating.period=17`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      expect(data.artObjects.length).toBeGreaterThan(0);

      // Note: Multiple period filters don't work as expected with this API
      // The API seems to only handle single period filters effectively
    });

    test('should handle invalid API key gracefully', async ({ request }) => {
      const response = await request.get(`collection?key=invalid_key`);

      // API should return an error for invalid key
      expect(response.status()).toBe(401);
    });

    test('should handle missing API key gracefully', async ({ request }) => {
      const response = await request.get(`collection`);

      // API should return an error for missing key
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Object Details Tests', () => {

    test('should retrieve detailed information for a specific art object', async ({ request }) => {
      // First get a collection to find an object ID
      const collectionResponse = await request.get(`collection?key=${API_KEY}&ps=1`);
      expect(collectionResponse.ok()).toBeTruthy();

      const collectionData = await collectionResponse.json();
      expect(collectionData.artObjects.length).toBeGreaterThan(0);

      const objectId = collectionData.artObjects[0].objectNumber;
      expect(objectId).toBeDefined();

      // Now get detailed information for this object
      const detailResponse = await request.get(`collection/${objectId}?key=${API_KEY}`);
      expect(detailResponse.ok()).toBeTruthy();
      expect(detailResponse.status()).toBe(200);

      const detailData = await detailResponse.json();
      expect(detailData.artObject).toBeDefined();
      expect(detailData.artObject.objectNumber).toBe(objectId);
      expect(detailData.artObject.title).toBeDefined();
      expect(detailData.artObject.principalOrFirstMaker).toBeDefined();
    });

    test('should retrieve object details with all available fields', async ({ request }) => {
      // Get a collection to find an object ID
      const collectionResponse = await request.get(`collection?key=${API_KEY}&ps=1`);
      expect(collectionResponse.ok()).toBeTruthy();

      const collectionData = await collectionResponse.json();
      const objectId = collectionData.artObjects[0].objectNumber;

      // Get detailed information
      const detailResponse = await request.get(`collection/${objectId}?key=${API_KEY}`);
      expect(detailResponse.ok()).toBeTruthy();

      const detailData = await detailResponse.json();
      const artObject = detailData.artObject;

      // Verify essential fields are present
      expect(artObject.objectNumber).toBeDefined();
      expect(artObject.title).toBeDefined();
      expect(artObject.principalOrFirstMaker).toBeDefined();
      expect(artObject.dating).toBeDefined();
      expect(artObject.physicalMedium).toBeDefined();
      expect(artObject.dimensions).toBeDefined();
    });

    test('should handle non-existent object ID gracefully', async ({ request }) => {
      const nonExistentId = 'SK-A-999999';
      const response = await request.get(`collection/${nonExistentId}?key=${API_KEY}`);

      // Note: The API returns 200 with artObject: null for non-existent objects
      // This is different from typical REST APIs that return 404
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.artObject).toBeNull();
      expect(data.artObjectPage).toBeNull();
    });

    test('should retrieve object details with different languages', async ({ request }) => {
      // Get a collection to find an object ID
      const collectionResponse = await request.get(`collection?key=${API_KEY}&ps=1`);
      expect(collectionResponse.ok()).toBeTruthy();

      const collectionData = await collectionResponse.json();
      const objectId = collectionData.artObjects[0].objectNumber;

      // Test Dutch language
      const dutchResponse = await request.get(`../nl/collection/${objectId}?key=${API_KEY}`);
      expect(dutchResponse.ok()).toBeTruthy();

      const dutchData = await dutchResponse.json();
      expect(dutchData.artObject).toBeDefined();
    });
  });

  test.describe('API Behavior and Edge Cases', () => {

    test('should handle large page sizes appropriately', async ({ request }) => {
      const response = await request.get(`collection?key=${API_KEY}&ps=1000`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      // API might limit maximum page size
      expect(data.artObjects.length).toBeLessThanOrEqual(1000);
    });

    test('should handle special characters in search queries', async ({ request }) => {
      const specialQuery = 'café & museum';
      const response = await request.get(`collection?key=${API_KEY}&q=${encodeURIComponent(specialQuery)}`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
    });

    test('should handle empty search results gracefully', async ({ request }) => {
      const impossibleQuery = 'xyz123nonexistent';
      const response = await request.get(`collection?key=${API_KEY}&q=${encodeURIComponent(impossibleQuery)}`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.artObjects).toBeDefined();
      expect(data.artObjects.length).toBe(0);
      expect(data.count).toBe(0);
    });

    test('should validate response structure consistency', async ({ request }) => {
      const response = await request.get(`collection?key=${API_KEY}&ps=5`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();

      // Verify consistent response structure
      expect(data).toHaveProperty('elapsedMilliseconds');
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('artObjects');
      expect(data).toHaveProperty('facets');

      // Verify artObjects structure
      if (data.artObjects.length > 0) {
        const firstObject = data.artObjects[0];
        expect(firstObject).toHaveProperty('objectNumber');
        expect(firstObject).toHaveProperty('title');
        expect(firstObject).toHaveProperty('principalOrFirstMaker');
        expect(firstObject).toHaveProperty('webImage');
      }
    });
  });
});
