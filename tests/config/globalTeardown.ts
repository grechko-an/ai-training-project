/**
 * Global test teardown
 * Runs once after all test suites complete
 * Used for cleanup, report generation, etc.
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('========================================');
  console.log('  Global Test Teardown');
  console.log('========================================');

  // Cleanup temporary test data
  // In a real scenario, this would clean up test users, orders, etc.

  // Generate Allure report if allure-results exist
  const fs = require('fs');
  const allureResultsPath = './tests/reports/allure-results';

  if (fs.existsSync(allureResultsPath)) {
    const files = fs.readdirSync(allureResultsPath);
    if (files.length > 0) {
      console.log(`  Allure results: ${files.length} files generated`);
    } else {
      console.log('  No Allure results generated');
    }
  }

  // Log test results summary
  console.log('  Test execution completed');
  console.log('  Reports available in: ./tests/reports/');
  console.log('========================================\n');
}

export default globalTeardown;