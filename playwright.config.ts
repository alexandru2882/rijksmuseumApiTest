import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  workers: 3,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://www.rijksmuseum.nl/api/nl/',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
};

export default config;
