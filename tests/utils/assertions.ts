/**
 * Custom assertion utilities for tests
 * Provides reusable assertion methods for API and E2E tests
 */

import { expect, APIResponse } from '@playwright/test';
import { ApiResponse, ApiError } from '../types';

// ===========================================
// API Response Assertions
// ===========================================

/**
 * Assert that an API response has a successful status code (2xx)
 */
export function assertApiSuccess(response: ApiResponse): void {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
}

/**
 * Assert that an API response has a specific status code
 */
export function assertApiStatus(response: ApiResponse, expectedStatus: number): void {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Assert that an API response contains expected properties
 */
export function assertApiResponseHasProperties(response: ApiResponse, properties: string[]): void {
  for (const property of properties) {
    expect(response.data).toHaveProperty(property);
  }
}

/**
 * Assert that an API response data matches expected structure
 */
export function assertApiResponseStructure<T extends Record<string, unknown>>(
  response: ApiResponse<T>,
  expectedShape: Record<keyof T, string>
): void {
  for (const [key, type] of Object.entries(expectedShape)) {
    expect(response.data).toHaveProperty(key);
    expect(typeof (response.data as Record<string, unknown>)[key]).toBe(type);
  }
}

/**
 * Assert that an API error response has expected structure
 */
export function assertApiError(error: ApiError, expectedStatus: number, expectedCode?: string): void {
  expect(error.status).toBe(expectedStatus);
  if (expectedCode) {
    expect(error.code).toBe(expectedCode);
  }
}

/**
 * Assert that a paginated API response has valid pagination data
 */
export function assertPaginatedResponse(response: ApiResponse): void {
  assertApiResponseHasProperties(response, ['data', 'total', 'page', 'pageSize', 'totalPages']);
  expect(Array.isArray((response.data as { data: unknown[] }).data)).toBe(true);
  expect(typeof (response.data as { total: number }).total).toBe('number');
  expect(typeof (response.data as { page: number }).page).toBe('number');
}

// ===========================================
// Data Validation Assertions
// ===========================================

/**
 * Assert that a string is a valid email format
 */
export function assertValidEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(email).toMatch(emailRegex);
}

/**
 * Assert that a string is a valid UUID
 */
export function assertValidUUID(uuid: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  expect(uuid).toMatch(uuidRegex);
}

/**
 * Assert that a value is a valid ISO date string
 */
export function assertValidISODate(dateString: string): void {
  const date = new Date(dateString);
  expect(date.toISOString()).toBe(dateString);
}

/**
 * Assert that a number is within a range
 */
export function assertNumberInRange(value: number, min: number, max: number): void {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}

/**
 * Assert that a string is not empty
 */
export function assertNotEmpty(value: string, fieldName?: string): void {
  const message = fieldName ? `Expected ${fieldName} to not be empty` : undefined;
  expect(value, message).toBeTruthy();
  expect(value.trim(), message).not.toBe('');
}

// ===========================================
// Array Assertions
// ===========================================

/**
 * Assert that an array is not empty
 */
export function assertArrayNotEmpty<T>(array: T[], message?: string): void {
  expect(array.length, message || 'Expected array to not be empty').toBeGreaterThan(0);
}

/**
 * Assert that an array has a specific length
 */
export function assertArrayLength<T>(array: T[], expectedLength: number): void {
  expect(array).toHaveLength(expectedLength);
}

/**
 * Assert that all items in an array satisfy a condition
 */
export function assertAllItems<T>(array: T[], predicate: (item: T) => boolean, message?: string): void {
  for (let i = 0; i < array.length; i++) {
    expect(predicate(array[i]), message || `Item at index ${i} failed predicate`).toBe(true);
  }
}

// ===========================================
// HTTP Header Assertions
// ===========================================

/**
 * Assert that a response has a specific header
 */
export function assertResponseHasHeader(response: ApiResponse, headerName: string): void {
  expect(response.headers).toHaveProperty(headerName.toLowerCase());
}

/**
 * Assert that a response header has a specific value
 */
export function assertResponseHeaderValue(response: ApiResponse, headerName: string, expectedValue: string): void {
  expect(response.headers[headerName.toLowerCase()]).toBe(expectedValue);
}

/**
 * Assert that a response has CORS headers
 */
export function assertCorsHeaders(response: ApiResponse): void {
  assertResponseHasHeader(response, 'access-control-allow-origin');
  assertResponseHasHeader(response, 'access-control-allow-methods');
  assertResponseHasHeader(response, 'access-control-allow-headers');
}

// ===========================================
// Performance Assertions
// ===========================================

/**
 * Assert that a response time is within acceptable limits
 */
export function assertResponseTime(responseTime: number, maxTimeMs: number): void {
  expect(responseTime).toBeLessThanOrEqual(maxTimeMs);
}

/**
 * Assert that a test execution time is within acceptable limits
 */
export function assertExecutionTime(executionTime: number, maxTimeMs: number): void {
  expect(executionTime).toBeLessThanOrEqual(maxTimeMs);
}

// ===========================================
// Playwright Response Assertions
// ===========================================

/**
 * Assert that a Playwright APIResponse is successful
 */
export async function assertPlaywrightResponseOk(response: APIResponse): Promise<void> {
  expect(response.ok()).toBe(true);
}

/**
 * Assert that a Playwright APIResponse has a specific status
 */
export async function assertPlaywrightResponseStatus(response: APIResponse, expectedStatus: number): Promise<void> {
  expect(response.status()).toBe(expectedStatus);
}

/**
 * Assert that a Playwright APIResponse body matches expected JSON structure
 */
export async function assertPlaywrightResponseBodyHasProperties(
  response: APIResponse,
  properties: string[]
): Promise<void> {
  const body = await response.json();
  for (const property of properties) {
    expect(body).toHaveProperty(property);
  }
}