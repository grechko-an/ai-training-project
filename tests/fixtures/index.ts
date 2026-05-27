/**
 * Custom Playwright fixtures
 * Provides reusable test fixtures for E2E and API tests
 */

import { test as base, Page, APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../api/clients/BaseApiClient';
import { loadEnvironmentConfig, EnvironmentConfig } from '../config/environment';

// ===========================================
// Custom Fixtures
// ===========================================

// Extend the base test with custom fixtures
export const test = base.extend<{
  config: EnvironmentConfig;
  apiClient: BaseApiClient;
  authenticatedPage: Page;
  authenticatedApiClient: BaseApiClient;
  testData: {
    uniqueId: string;
    timestamp: number;
  };
}>({
  /**
   * Environment configuration fixture
   * Provides access to environment variables and configuration
   */
  config: async ({}, use) => {
    const config = loadEnvironmentConfig();
    await use(config);
  },

  /**
   * API client fixture
   * Provides a pre-configured API client for making API requests
   */
  apiClient: async ({}, use) => {
    const config = loadEnvironmentConfig();
    const client = new BaseApiClient(config.apiBaseUrl, config.apiVersion, config.apiTimeout);
    await use(client);
  },

  /**
   * Authenticated page fixture
   * Provides a page that is already authenticated (simulated)
   * In a real scenario, this would handle login/session setup
   */
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: undefined,
    });
    const page = await context.newPage();

    // Simulate authentication by setting localStorage/session
    await page.goto(loadEnvironmentConfig().baseUrl);
    await page.evaluate((token) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('is_authenticated', 'true');
    }, 'test-auth-token');

    await use(page);
    await context.close();
  },

  /**
   * Authenticated API client fixture
   * Provides an API client with authentication token set
   */
  authenticatedApiClient: async ({}, use) => {
    const config = loadEnvironmentConfig();
    const client = new BaseApiClient(config.apiBaseUrl, config.apiVersion, config.apiTimeout);
    client.setAuthToken(config.authToken || 'test-auth-token');
    await use(client);
  },

  /**
   * Test data fixture
   * Provides unique test data identifiers for test isolation
   */
  testData: async ({}, use) => {
    const data = {
      uniqueId: `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: Date.now(),
    };
    await use(data);
  },
});

// ===========================================
// Re-export Playwright's expect and other utilities
// ===========================================

export { expect } from '@playwright/test';
export type { Page, APIRequestContext, APIResponse } from '@playwright/test';