/**
 * Global test setup
 * Runs once before all test suites
 * Used for setting up test data, environment configuration, etc.
 */

import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('========================================');
  console.log('  Global Test Setup');
  console.log('========================================');

  // Load environment variables
  const envFile = process.env.ENV ? `.env.${process.env.ENV}` : '.env';
  dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

  // Log configuration
  console.log(`  Environment: ${process.env.TEST_ENV || 'local'}`);
  console.log(`  Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);
  console.log(`  API Base URL: ${process.env.API_BASE_URL || 'http://localhost:3000/api'}`);
  console.log(`  CI Mode: ${process.env.CI || 'false'}`);
  console.log('========================================');

  // Validate required environment variables
  const requiredVars = ['BASE_URL', 'API_BASE_URL'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`  Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('  Using default values. Set these in your .env file.');
  }

  // Create test results directory
  const fs = require('fs');
  const dirs = [
    './test-results',
    './test-results/screenshots',
    './test-results/videos',
    './test-results/traces',
    './tests/reports/allure-results',
    './tests/reports/html',
    './tests/reports/junit',
    './tests/reports/json',
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created directory: ${dir}`);
    }
  }

  console.log('========================================\n');
}

export default globalSetup;