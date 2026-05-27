/**
 * Authentication API Tests
 * Tests the authentication API endpoints
 * Demonstrates API testing patterns with Playwright
 *
 * Tags:
 * @P0 - Critical functionality
 * @P1 - Major functionality
 * @P2 - Minor functionality or edge cases
 * @P3 - Nice-to-have, low-risk scenarios
 * @api - API test
 * @smoke - Smoke test suite
 * @regression - Regression test suite
 */

import { test, expect } from '../../fixtures';
import { AuthApiClient } from '../clients/AuthApiClient';
import { TestDataGenerator } from '../../utils/testDataGenerator';
import { assertApiSuccess, assertApiStatus, assertApiResponseHasProperties, assertApiError } from '../../utils/assertions';

test.describe('Authentication API', () => {
  let authClient: AuthApiClient;

  test.beforeEach(async ({ config }) => {
    authClient = new AuthApiClient(config.apiBaseUrl, config.apiVersion, config.apiTimeout);
  });

  // ===========================================
  // P0 - Critical: Authentication
  // ===========================================

  test.describe('P0 - Critical Auth Scenarios', () => {
    test('should successfully login with valid credentials @P0 @smoke @api', async () => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';

      // Act
      const response = await authClient.login(username, password);

      // Assert
      assertApiSuccess(response);
      assertApiResponseHasProperties(response, ['token', 'expiresIn', 'tokenType']);
      expect(response.data.token).toBeTruthy();
      expect(response.data.tokenType).toBe('Bearer');
      expect(authClient.isAuthenticated()).toBe(true);
    });

    test('should reject invalid credentials with 401 @P0 @smoke @api', async () => {
      // Arrange
      const invalidUsername = 'invalid_user';
      const invalidPassword = 'wrong_password';

      // Act & Assert
      try {
        await authClient.login(invalidUsername, invalidPassword);
        // If no error thrown, fail the test
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        assertApiError(error, 401, 'UNAUTHORIZED');
      }
    });

    test('should return user profile with valid token @P0 @smoke @api', async () => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';
      await authClient.login(username, password);

      // Act
      const profileResponse = await authClient.getCurrentUser();

      // Assert
      assertApiSuccess(profileResponse);
      assertApiResponseHasProperties(profileResponse, ['id', 'username', 'email', 'role']);
      expect(profileResponse.data.username).toBe(username);
    });
  });

  // ===========================================
  // P1 - Major: User Registration
  // ===========================================

  test.describe('P1 - User Registration', () => {
    test('should register a new user successfully @P1 @regression @api', async () => {
      // Arrange
      const newUser = TestDataGenerator.generateUser();

      // Act
      const response = await authClient.register({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });

      // Assert
      assertApiStatus(response, 201);
      assertApiResponseHasProperties(response, ['id', 'username', 'email', 'token']);
      expect(response.data.username).toBe(newUser.username);
      expect(response.data.email).toBe(newUser.email);
    });

    test('should reject registration with existing username @P1 @regression @api', async () => {
      // Arrange
      const existingUsername = process.env.TEST_USER_USERNAME || 'testuser';
      const newUser = TestDataGenerator.generateUser({ username: existingUsername });

      // Act & Assert
      try {
        await authClient.register({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        });
        // If no error thrown, fail the test
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.status).toBe(409); // Conflict
      }
    });

    test('should reject registration with invalid email format @P1 @regression @api', async () => {
      // Arrange
      const invalidEmail = 'not-an-email';

      // Act & Assert
      try {
        await authClient.register({
          username: 'newuser',
          email: invalidEmail,
          password: 'Password123!',
        });
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });
  });

  // ===========================================
  // P2 - Minor: Token Management
  // ===========================================

  test.describe('P2 - Token Management', () => {
    test('should refresh token successfully @P2 @regression @api', async () => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';
      await authClient.login(username, password);

      // Act
      const refreshResponse = await authClient.refreshToken('dummy-refresh-token');

      // Assert
      assertApiSuccess(refreshResponse);
      assertApiResponseHasProperties(refreshResponse, ['token', 'expiresIn']);
    });

    test('should logout successfully @P2 @regression @api', async () => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';
      await authClient.login(username, password);
      expect(authClient.isAuthenticated()).toBe(true);

      // Act
      const logoutResponse = await authClient.logout();

      // Assert
      assertApiSuccess(logoutResponse);
      expect(authClient.isAuthenticated()).toBe(false);
    });

    test('should reject requests with expired token @P2 @regression @api', async () => {
      // Arrange
      authClient.setAuthToken('expired-token');

      // Act & Assert
      try {
        await authClient.getCurrentUser();
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.status).toBe(401);
      }
    });
  });

  // ===========================================
  // P3 - Nice-to-Have: Password Management
  // ===========================================

  test.describe('P3 - Password Management', () => {
    test('should send password reset email @P3 @regression @api', async () => {
      // Arrange
      const email = 'test@example.com';

      // Act
      const response = await authClient.forgotPassword(email);

      // Assert
      assertApiSuccess(response);
      expect(response.data.message).toBeTruthy();
    });

    test('should change password successfully @P3 @regression @api', async () => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';
      await authClient.login(username, password);

      // Act
      const response = await authClient.changePassword(password, 'NewPassword123!');

      // Assert
      assertApiSuccess(response);
      expect(response.data.message).toBeTruthy();
    });

    test('should check username availability @P3 @regression @api', async () => {
      // Act
      const response = await authClient.checkUsername('new_unique_user');

      // Assert
      assertApiSuccess(response);
      assertApiResponseHasProperties(response, ['available']);
      expect(typeof response.data.available).toBe('boolean');
    });
  });

  // ===========================================
  // Negative Testing
  // ===========================================

  test.describe('Negative API Tests', () => {
    test('should reject empty request body @P2 @regression @api', async () => {
      // Act & Assert
      try {
        await authClient.login('', '');
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });

    test('should reject SQL injection attempts @P2 @regression @api', async () => {
      // Arrange
      const sqlInjection = "' OR '1'='1";

      // Act & Assert
      try {
        await authClient.login(sqlInjection, sqlInjection);
        expect(false).toBe(true);
      } catch (error: any) {
        // Should not authenticate with SQL injection
        expect(error.status).toBe(401);
      }
    });

    test('should reject XSS attempts @P2 @regression @api', async () => {
      // Arrange
      const xssPayload = '<script>alert("xss")</script>';

      // Act & Assert
      try {
        await authClient.register({
          username: xssPayload,
          email: 'xss@test.com',
          password: 'Password123!',
        });
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });
  });

  // ===========================================
  // Data-Driven API Tests
  // ===========================================

  test.describe('Data-Driven API Tests', () => {
    const apiTestCases = TestDataGenerator.generateApiTestData().filter(tc => tc.endpoint.includes('user'));

    apiTestCases.forEach(({ method, endpoint, body, expectedStatus, description }) => {
      test(`[${method}] ${endpoint} - ${description} @P2 @regression @api`, async () => {
        // Act
        let response;
        try {
          switch (method) {
            case 'GET':
              response = await authClient.get(endpoint);
              break;
            case 'POST':
              response = await authClient.post(endpoint, body);
              break;
            case 'PUT':
              response = await authClient.put(endpoint, body);
              break;
            case 'DELETE':
              response = await authClient.delete(endpoint);
              break;
          }
          // If we get a response, check status
          if (response) {
            expect(response.status).toBe(expectedStatus);
          }
        } catch (error: any) {
          // If error thrown, check status matches expected
          expect(error.status).toBe(expectedStatus);
        }
      });
    });
  });
});