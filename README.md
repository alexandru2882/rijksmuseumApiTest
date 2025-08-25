# rijksmuseumApiTest

Simple Playwright + TypeScript setup for API testing of the free Rijksmuseum API.

## Prerequisites
- Node.js 18+ and npm

## Setup
1. Install dependencies:
   npm install

2. Configure your API key:
   cp .env.example .env
   # edit .env and set RIJKS_API_KEY=your_key_here
   # For this assignment, you can use: RIJKS_API_KEY=0fiuZFh4

## Running tests
- Local:
  - Without an API key, live tests will be skipped:
    npx playwright test
  - With an API key set in .env, live API tests will run:
    npx playwright test
  - View HTML report:
    npx playwright show-report

- CI (GitHub Actions):
  - Workflow: .github/workflows/ci.yml
  - It uses the repository secret RIJKS_API_KEY if set; otherwise it falls back to the public key provided for this assignment.
  - To use your own key in CI, add it as a repository secret named RIJKS_API_KEY.

## Implemented tests
- Retrieve collections with a search query and basic assertions on the response.
- Retrieve details of an object from a search result.
- Pagination behavior: page 1 vs page 2 should not overlap.
- Negative behavior without API key: request should not succeed (expect 401/403/400).

## Notes
- Tests use Playwright’s request fixture and do not launch a browser.
- Base API endpoint: https://www.rijksmuseum.nl/api/en
- URLs are built with format=json by default.
