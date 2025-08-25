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

## Running tests
- Without an API key, live tests will be skipped:
  npx playwright test

- With an API key set in .env, live API tests will run:
  npx playwright test

- View HTML report:
  npx playwright show-report

## Notes
- Tests use Playwright’s request fixture and do not launch a browser.
- Base API endpoint: https://www.rijksmuseum.nl/api/en
