# Rijksmuseum API Test Suite

This project contains automated API tests for the Rijksmuseum API using Playwright and TypeScript. It provides a robust framework for testing the Rijksmuseum's public API endpoints.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A code editor (VS Code recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/alexandru2882/rijksmuseumApiTest.git
cd rijksmuseumApiTest
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

1. Get your API key from the Rijksmuseum:
   - Visit [Rijksmuseum Research Services](https://www.rijksmuseum.nl/en/research/conduct-research/data)
   - Register for an API key
   - Copy your API key

2. Create a `.env` file in the project root:
```bash
touch .env
```

3. Add your API key to the `.env` file:
```plaintext
RIJKSMUSEUM_API_KEY=your_api_key_here
```

## Project Structure

```
rijksmuseumApiTest/
├── node_modules/           # Dependencies
├── tests/                 # Test files
│   └── example.api.spec.ts
├── playwright.config.ts   # Playwright configuration
├── package.json          # Project configuration and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## Available Scripts

- Run all tests:
```bash
npm test
```

- Run tests in headed mode (with browser UI):
```bash
npm run test:headed
```

- Run tests in debug mode:
```bash
npm run test:debug
```

- Show the HTML report of the last test run:
```bash
npm run show-report
```

## First Run Experience

1. After installation, verify the setup:
```bash
npx playwright test --list
```
This should show the available tests.

2. Run your first test:
```bash
npm test
```
Note: Make sure you've added your API key to the `.env` file before running tests.

3. View the test report:
```bash
npm run show-report
```

## Writing Tests

Tests are written in TypeScript using the Playwright test framework. Here's a basic example:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Rijksmuseum API Tests', () => {
  test('should get collection details', async ({ request }) => {
    const response = await request.get(`collection?key=${process.env.RIJKSMUSEUM_API_KEY}`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toBeDefined();
  });
});
```

## Browser Support

This test suite supports running tests in:
- Chromium
- Firefox
- WebKit

To run tests in a specific browser:
```bash
npm test -- --project=chromium
npm test -- --project=firefox
npm test -- --project=webkit
```

## CI/CD Integration

The project is ready for CI/CD integration. The Playwright configuration is optimized for both local development and CI environments.

## Troubleshooting

If you encounter any issues:

1. Verify your Node.js version:
```bash
node --version
```

2. Check if Playwright browsers are installed:
```bash
npx playwright install --help
```

3. Ensure your API key is correctly set in the `.env` file

4. For WSL users on Windows, ensure you have the necessary dependencies:
```bash
npx playwright install-deps
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the `package.json` file for details.

## Acknowledgments

- [Rijksmuseum API Documentation](https://data.rijksmuseum.nl/object-metadata/api/)
- [Playwright Documentation](https://playwright.dev/)
