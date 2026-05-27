/**
 * Helper utility functions for tests
 * Provides common helper methods used across E2E and API tests
 */

import { Page } from '@playwright/test';
import * as crypto from 'crypto';

// ===========================================
// String Utilities
// ===========================================

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * Generate a random email address
 */
export function generateRandomEmail(domain: string = 'test.com'): string {
  return `test.${generateRandomString(8).toLowerCase()}@${domain}`;
}

/**
 * Generate a random phone number
 */
export function generateRandomPhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  return `+1${areaCode}${prefix}${lineNumber}`;
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a UUID v4 string
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Format a date to ISO string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Format a date to a readable format (YYYY-MM-DD)
 */
export function formatDateShort(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===========================================
// Data Generators
// ===========================================

/**
 * Generate a random user object for test data
 */
export function generateTestUser(overrides?: Partial<{
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}>): {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} {
  return {
    username: overrides?.username || `user_${generateRandomString(8).toLowerCase()}`,
    email: overrides?.email || generateRandomEmail(),
    password: overrides?.password || 'Test@123456',
    firstName: overrides?.firstName || `Test${generateRandomString(5)}`,
    lastName: overrides?.lastName || `User${generateRandomString(5)}`,
  };
}

/**
 * Generate test product data
 */
export function generateTestProduct(overrides?: Partial<{
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  quantity: number;
}>): {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  quantity: number;
} {
  return {
    name: overrides?.name || `Test Product ${generateRandomString(6)}`,
    description: overrides?.description || `Automated test product - ${generateRandomString(20)}`,
    price: overrides?.price || parseFloat((Math.random() * 1000).toFixed(2)),
    category: overrides?.category || 'Test Category',
    sku: overrides?.sku || `SKU-${generateRandomString(10).toUpperCase()}`,
    quantity: overrides?.quantity || generateRandomNumber(1, 100),
  };
}

// ===========================================
// Browser/Page Utilities
// ===========================================

/**
 * Wait for a specific network request to complete
 */
export async function waitForNetworkResponse(
  page: Page,
  urlPattern: string | RegExp,
  method: string = 'GET',
  timeout: number = 10000
): Promise<void> {
  await page.waitForResponse(
    (response) => {
      const urlMatch = typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url());
      return urlMatch && response.request().method() === method;
    },
    { timeout }
  );
}

/**
 * Block specific network requests (useful for performance testing)
 */
export async function blockNetworkRequests(page: Page, patterns: string[]): Promise<void> {
  await page.route(patterns.join('|'), (route) => route.abort());
}

/**
 * Mock a network response
 */
export async function mockNetworkResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseBody: unknown,
  status: number = 200
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });
}

// ===========================================
// Time Utilities
// ===========================================

/**
 * Pause execution for a specified duration
 * Use sparingly - prefer explicit waits over fixed delays
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Measure execution time of a function
 */
export async function measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}

// ===========================================
// Environment Utilities
// ===========================================

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return process.env.CI === 'true';
}

/**
 * Get current test environment
 */
export function getTestEnvironment(): string {
  return process.env.TEST_ENV || 'local';
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  const featureFlag = process.env[`FEATURE_${featureName.toUpperCase()}`];
  return featureFlag === 'true' || featureFlag === '1';
}

// ===========================================
// Array/Collection Utilities
// ===========================================

/**
 * Pick a random item from an array
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random items from an array
 */
export function pickRandomMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Create a range of numbers
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}