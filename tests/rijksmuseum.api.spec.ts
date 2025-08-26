import { test, expect } from '@playwright/test';

// API key from environment variable
const API_KEY = process.env.API_KEY;

test.describe('Rijksmuseum API Core Tests', () => {

  /**
   * Test 1: API Connectivity and Response Structure
   * Purpose: Validates that the API is accessible and returns the expected data structure.
   * Importance: This is the foundational test that ensures the API is working and
   * responding with the correct JSON format before testing specific data fields.
   */
  test('should connect to API and return proper response structure', async ({ request }) => {
    // Make API request to verify connectivity
    const response = await request.get(`collection?key=${API_KEY}`);
    expect(response.status()).toBe(200);  // Verify successful HTTP response

    // Parse and validate basic response structure
    const data = await response.json();
    expect(data).toBeDefined();           // Response can be parsed as JSON
    expect(data.artObjects).toBeDefined(); // Contains artworks array
    expect(data.count).toBeDefined();      // Contains total count
    expect(Array.isArray(data.artObjects)).toBe(true); // artObjects is an array
    expect(data.count).toBeGreaterThan(0); // Collection is not empty
  });

  /**
   * Test 2: Artwork Data Fields Validation
   * Purpose: Ensures that individual artwork objects contain all required fields.
   * Importance: Validates the data quality and completeness of artwork records,
   * which is essential for client applications to function properly.
   */
  test('should return artwork objects with all required fields', async ({ request }) => {
    // Retrieve collection data
    const response = await request.get(`collection?key=${API_KEY}`);
    const data = await response.json();

    // Get first artwork for field validation
    const artwork = data.artObjects[0];

    // Verify required identification fields
    expect(artwork.objectNumber).toBeDefined();  // Unique identifier for the artwork
    expect(typeof artwork.objectNumber).toBe('string'); // Should be string format

    // Verify required descriptive fields
    expect(artwork.title).toBeDefined();         // Artwork title
    expect(typeof artwork.title).toBe('string'); // Should be string format

    // Verify required attribution fields
    expect(artwork.principalOrFirstMaker).toBeDefined(); // Artist information
    expect(typeof artwork.principalOrFirstMaker).toBe('string'); // Should be string format

    // Verify linking fields
    expect(artwork.links).toBeDefined();         // Navigation links
    expect(artwork.links.self).toBeDefined();    // Self-reference link
    expect(artwork.links.web).toBeDefined();     // Web view link
  });

  /**
   * Test 3: Collection Pagination
   * Purpose: Ensures the API can return specific subsets of the collection.
   * Importance: Essential for handling large datasets and implementing 
   * efficient data loading in client applications.
   */
  test('should handle collection pagination', async ({ request }) => {
    // Define pagination parameters, using small page size to ensure quick and predictable results
    const PAGE_SIZE = 5;

    // Request specific page size from collection, which tests the API's ability to limit result set
    const response = await request.get(`collection?key=${API_KEY}&ps=${PAGE_SIZE}`);
    expect(response.status()).toBe(200);

    // Verify exact number of results returned, to ensure API respects the pagination parameters
    const data = await response.json();
    expect(data.artObjects.length).toBe(PAGE_SIZE);
  });

  /**
   * Test 4: Detailed Artwork Information
   * Purpose: Validates the ability to retrieve complete information about a specific artwork.
   * Importance: Getting detailed object information after finding it in the collection.
   * Tests both collection browsing and detail retrieval flow.
   */
  test('should retrieve detailed artwork information', async ({ request }) => {
    // Get an artwork ID from collection, to test details endpoint
    const collectionResponse = await request.get(`collection?key=${API_KEY}&ps=1`);
    expect(collectionResponse.status()).toBe(200);

    // Extract object ID from collection response, using first artwork as a representative sample
    const collectionData = await collectionResponse.json();
    const objectId = collectionData.artObjects[0].objectNumber;

    // Retrieve detailed information
    const detailResponse = await request.get(`collection/${objectId}?key=${API_KEY}`);
    expect(detailResponse.status()).toBe(200);

    // Validate detailed artwork data to ensure all required fields are present and correctly structured
    const detailData = await detailResponse.json();
    const artObject = detailData.artObject;

    // Verify core artwork details
    expect(artObject.objectNumber).toBe(objectId);     // ID should match what we requested
    expect(artObject.title).toBeDefined();             // Title is required
    expect(artObject.principalOrFirstMaker).toBeDefined(); // Artist info is required

    // Verify additional metadata, to provide important artwork context
    expect(artObject.dating).toBeDefined();        // Time period information
    expect(artObject.physicalMedium).toBeDefined(); // Material information
    expect(artObject.dimensions).toBeDefined();     // Size information
  });

  /**
   * Test 5: Collection Search
   * Purpose: Validates the ability to search and filter the collection.
   * Importance: Essential for finding specific artworks in a large collection.
   * Tests both the search functionality and result relevance.
   */
  test('should search collection effectively', async ({ request }) => {
    // Define search parameters: using Rembrandt as he's well-represented in the collection
    const ARTIST_NAME = 'Rembrandt';

    // Perform search request, to test the API's search functionality
    const response = await request.get(`collection?key=${API_KEY}&q=${ARTIST_NAME}`);
    expect(response.status()).toBe(200);

    // Verify search returned results, to ensure search functionality is working
    const data = await response.json();
    expect(data.artObjects.length).toBeGreaterThan(0);

    // Validate search relevance
    // Checks if results actually contain the search term
    // Looking in both title and artist fields for maximum coverage
    const foundRelevantArtwork = data.artObjects.some((art: any) =>
      (art.title || '').toLowerCase().includes(ARTIST_NAME.toLowerCase()) ||
      (art.principalOrFirstMaker || '').toLowerCase().includes(ARTIST_NAME.toLowerCase())
    );
    expect(foundRelevantArtwork).toBe(true);
  });
});