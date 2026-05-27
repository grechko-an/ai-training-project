/**
 * Shared TypeScript interfaces and types for the test framework
 */

import { Page, Locator, APIResponse } from '@playwright/test';

// ===========================================
// Test Data Types
// ===========================================

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

// ===========================================
// API Types
// ===========================================

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
  response: APIResponse;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthTokenResponse {
  token: string;
  expiresIn: number;
  tokenType: string;
}

// ===========================================
// Page Object Types
// ===========================================

export interface PageElement {
  locator: Locator;
  name: string;
}

export interface NavigationItem {
  label: string;
  url: string;
  isActive: boolean;
}

export interface TableRow {
  cells: Record<string, string>;
  rowElement: Locator;
}

export interface FormField {
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea';
  required: boolean;
  placeholder?: string;
  value?: string;
}

// ===========================================
// Test Configuration Types
// ===========================================

export interface TestConfig {
  browser: string;
  viewport: { width: number; height: number };
  baseUrl: string;
  apiBaseUrl: string;
  isMobile: boolean;
  isHeadless: boolean;
}

export interface TestTags {
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  type: 'smoke' | 'regression' | 'e2e' | 'api' | 'ui' | 'integration';
  feature?: string;
}

// ===========================================
// Reporting Types
// ===========================================

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped' | 'flaky';
  duration: number;
  error?: string;
  screenshot?: string;
  video?: string;
  trace?: string;
}

export interface TestSuiteResult {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

// ===========================================
// Utility Types
// ===========================================

export type WaitForOptions = {
  timeout?: number;
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
};

export type NavigationOptions = {
  timeout?: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
};