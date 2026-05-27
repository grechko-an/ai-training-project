import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from the appropriate .env file
 * Default: .env (local development)
 * Can be overridden by ENV environment variable (e.g., ENV=staging, ENV=prod)
 */
const envFile = process.env.ENV ? `.env.${process.env.ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

/**
 * Base URL configuration
 * Can be set via environment variable or defaults to localhost
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export default defineConfig({
  /* Test configuration */
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : 1,
  reporter: [
    ['html', { outputFolder: './tests/reports/html', open: 'never' }],
  ],

  /* Timeout configuration */
  timeout: 60000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: { maxDiffPixels: 100 },
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/config/globalSetup'),
  globalTeardown: require.resolve('./tests/config/globalTeardown'),

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: './test-results',

  /* Web server configuration (uncomment when application is available) */
  // webServer: {
  //   command: 'npm run start',
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },

  /* Use configuration */
  use: {
    /* Base URL for all tests */
    baseURL: BASE_URL,

    /* Collect trace when a test fails */
    trace: 'on-first-retry',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Action timeouts */
    actionTimeout: 15000,
    navigationTimeout: 30000,

    /* Ignore HTTPS errors for testing */
    ignoreHTTPSErrors: true,

    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  /* Configure projects for multiple browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox'],
        },
      },
      grepInvert: /@mobile/,
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@mobile/,
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      grepInvert: /@mobile/,
    },

    /* Mobile browser configurations */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      grep: /@mobile/,
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
      grep: /@mobile/,
    },
  ],
});