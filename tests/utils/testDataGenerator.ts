/**
 * Test Data Generator
 * Provides methods to generate test data for various test scenarios
 * Supports data-driven testing with configurable data sets
 */

import { generateRandomString, generateRandomEmail, generateRandomNumber, generateUUID } from './helpers';

// ===========================================
// User Test Data
// ===========================================

export interface UserTestData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  phone: string;
  address: AddressTestData;
}

export interface AddressTestData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LoginTestData {
  username: string;
  password: string;
  expectedSuccess: boolean;
  expectedErrorMessage?: string;
}

export interface ProductTestData {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  quantity: number;
  isActive: boolean;
  tags: string[];
}

export interface OrderTestData {
  userId: string;
  products: Array<{ productId: string; quantity: number }>;
  shippingAddress: AddressTestData;
  paymentMethod: string;
  couponCode?: string;
}

// ===========================================
// Test Data Generator Class
// ===========================================

export class TestDataGenerator {
  /**
   * Generate a complete user profile for testing
   */
  static generateUser(overrides?: Partial<UserTestData>): UserTestData {
    return {
      username: overrides?.username || `user_${generateRandomString(8).toLowerCase()}`,
      email: overrides?.email || generateRandomEmail(),
      password: overrides?.password || 'Test@123456',
      firstName: overrides?.firstName || `Test${generateRandomString(5)}`,
      lastName: overrides?.lastName || `User${generateRandomString(5)}`,
      role: overrides?.role || 'user',
      phone: overrides?.phone || `+1${generateRandomNumber(100, 999)}${generateRandomNumber(100, 999)}${generateRandomNumber(1000, 9999)}`,
      address: overrides?.address || this.generateAddress(),
    };
  }

  /**
   * Generate address data
   */
  static generateAddress(overrides?: Partial<AddressTestData>): AddressTestData {
    return {
      street: overrides?.street || `${generateRandomNumber(100, 9999)} Test Street`,
      city: overrides?.city || 'Test City',
      state: overrides?.state || 'TS',
      zipCode: overrides?.zipCode || String(generateRandomNumber(10000, 99999)),
      country: overrides?.country || 'US',
    };
  }

  /**
   * Generate login test data sets
   * Returns multiple scenarios including valid and invalid credentials
   */
  static generateLoginTestData(): LoginTestData[] {
    return [
      {
        username: 'valid_user',
        password: 'valid_pass',
        expectedSuccess: true,
      },
      {
        username: 'invalid_user',
        password: 'wrong_pass',
        expectedSuccess: false,
        expectedErrorMessage: 'Invalid username or password',
      },
      {
        username: '',
        password: 'some_pass',
        expectedSuccess: false,
        expectedErrorMessage: 'Username is required',
      },
      {
        username: 'valid_user',
        password: '',
        expectedSuccess: false,
        expectedErrorMessage: 'Password is required',
      },
      {
        username: 'admin_user',
        password: 'admin_pass',
        expectedSuccess: true,
      },
    ];
  }

  /**
   * Generate a product for testing
   */
  static generateProduct(overrides?: Partial<ProductTestData>): ProductTestData {
    return {
      name: overrides?.name || `Test Product ${generateRandomString(8)}`,
      description: overrides?.description || `Automated test product - ${generateRandomString(20)}`,
      price: overrides?.price || parseFloat((Math.random() * 1000).toFixed(2)),
      category: overrides?.category || 'Electronics',
      sku: overrides?.sku || `SKU-${generateRandomString(10).toUpperCase()}`,
      quantity: overrides?.quantity || generateRandomNumber(1, 100),
      isActive: overrides?.isActive ?? true,
      tags: overrides?.tags || ['test', 'automation', 'e2e'],
    };
  }

  /**
   * Generate an order for testing
   */
  static generateOrder(overrides?: Partial<OrderTestData>): OrderTestData {
    return {
      userId: overrides?.userId || generateUUID(),
      products: overrides?.products || [
        { productId: generateUUID(), quantity: generateRandomNumber(1, 5) },
        { productId: generateUUID(), quantity: generateRandomNumber(1, 3) },
      ],
      shippingAddress: overrides?.shippingAddress || this.generateAddress(),
      paymentMethod: overrides?.paymentMethod || 'credit_card',
      couponCode: overrides?.couponCode,
    };
  }

  /**
   * Generate invalid/edge case data for negative testing
   */
  static generateInvalidData(): Record<string, unknown>[] {
    return [
      { value: null, description: 'null value' },
      { value: undefined, description: 'undefined value' },
      { value: '', description: 'empty string' },
      { value: '   ', description: 'whitespace only' },
      { value: '<script>alert("xss")</script>', description: 'XSS injection' },
      { value: "' OR '1'='1", description: 'SQL injection' },
      { value: -1, description: 'negative number' },
      { value: 0, description: 'zero value' },
      { value: Number.MAX_SAFE_INTEGER + 1, description: 'overflow number' },
      { value: 'a'.repeat(10001), description: 'very long string' },
      { value: '!@#$%^&*()', description: 'special characters only' },
      { value: { malicious: true }, description: 'object injection' },
    ];
  }

  /**
   * Generate test data for form validation testing
   */
  static generateFormValidationData(): Array<{ field: string; value: unknown; expectedError: string }> {
    return [
      { field: 'email', value: 'invalid-email', expectedError: 'Invalid email format' },
      { field: 'email', value: '', expectedError: 'Email is required' },
      { field: 'password', value: '123', expectedError: 'Password must be at least 6 characters' },
      { field: 'password', value: '', expectedError: 'Password is required' },
      { field: 'phone', value: 'abc', expectedError: 'Invalid phone number' },
      { field: 'zipCode', value: 'abcde', expectedError: 'Invalid zip code' },
      { field: 'age', value: -1, expectedError: 'Age must be positive' },
      { field: 'age', value: 0, expectedError: 'Age is required' },
    ];
  }

  /**
   * Generate API test data for CRUD operations
   */
  static generateApiTestData(): Array<{
    method: string;
    endpoint: string;
    body?: Record<string, unknown>;
    expectedStatus: number;
    description: string;
  }> {
    return [
      {
        method: 'GET',
        endpoint: '/users',
        expectedStatus: 200,
        description: 'Get all users',
      },
      {
        method: 'GET',
        endpoint: '/users/invalid-id',
        expectedStatus: 404,
        description: 'Get non-existent user',
      },
      {
        method: 'POST',
        endpoint: '/users',
        body: this.generateUser() as unknown as Record<string, unknown>,
        expectedStatus: 201,
        description: 'Create new user',
      },
      {
        method: 'POST',
        endpoint: '/users',
        body: {},
        expectedStatus: 400,
        description: 'Create user with empty body',
      },
      {
        method: 'PUT',
        endpoint: '/users/invalid-id',
        body: { name: 'Updated' },
        expectedStatus: 404,
        description: 'Update non-existent user',
      },
      {
        method: 'DELETE',
        endpoint: '/users/invalid-id',
        expectedStatus: 404,
        description: 'Delete non-existent user',
      },
    ];
  }
}

export default TestDataGenerator;