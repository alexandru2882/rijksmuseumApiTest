# Rijksmuseum API Test Suite

A comprehensive test suite for the Rijksmuseum API using Playwright and TypeScript, featuring parallel test execution, GitHub Actions integration, and extensive API coverage.

## Features

- 🚀 Parallel test execution with 5 workers
- 🔄 GitHub Actions CI/CD integration
- 🔒 Security audit integration
- 📊 Comprehensive test reporting
- 🌐 Multi-language API testing
- ⚡ Matrix testing across Node.js versions

## Prerequisites

- Node.js 20.x
- npm (included with Node.js)
- Git

## Quick Start

1. Clone and setup:
```bash
git clone https://github.com/alexandru2882/rijksmuseumApiTest.git
cd rijksmuseumApiTest
npm install
npx playwright install --with-deps
```

2. Create `.env` file:
```bash
API_KEY=your_api_key_here
```

3. Run tests:
```bash
npm test
```

## Project Structure

```
rijksmuseumApiTest/
├── .github/
│   └── workflows/        # GitHub Actions workflow
│       └── main.yml     # CI/CD configuration
├── tests/
│   └── rijksmuseum.api.spec.ts  # API test suite
├── playwright.config.ts  # Test configuration
├── package.json         # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # Documentation
```

## Test Categories

### 1. Collection Retrieval Tests
- Basic collection access
- Pagination functionality
- Search capabilities
- Artist filtering
- Period/date filtering
- Error handling

### 2. Object Details Tests
- Detailed artwork information
- Field validation
- Multi-language support
- Error scenarios

### 3. API Behavior Tests
- Large result sets
- Special character handling
- Empty results
- Response structure validation

## Available Scripts

- `npm test` - Run all tests in parallel
- `npm run test:headed` - Run tests with browser UI
- `npm run test:debug` - Run tests in debug mode
- `npm run show-report` - View HTML test report

## CI/CD Pipeline

The project uses GitHub Actions with:
- Matrix testing on Node.js 20.x
- Automated security audits
- Test artifact preservation
- Parallel test execution
- Comprehensive reporting

## Configuration

### Playwright Config (playwright.config.ts)
- 5 parallel workers
- 30-second timeout
- Automatic retries
- HTML and list reporting

### Environment Variables
Required in `.env`:
- `API_KEY`: Your Rijksmuseum API key

## Troubleshooting

1. **Tests Failing**
   - Verify API key in `.env`
   - Check Node.js version compatibility
   - Review test report for details

2. **CI Pipeline Issues**
   - Ensure GitHub Actions are enabled
   - Check workflow permissions
   - Verify secrets configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Create a pull request

## Resources

- [Rijksmuseum API Documentation](https://data.rijksmuseum.nl/object-metadata/api/)
- [Playwright Documentation](https://playwright.dev/)

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
