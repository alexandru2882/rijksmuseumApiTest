import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: 'https://www.rijksmuseum.nl/api/en'
  },
  workers: process.env.CI ? 2 : undefined
});
