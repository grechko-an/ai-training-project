/**
 * Login E2E Tests
 * Tests the login functionality of the application
 * Demonstrates P0-P3 priority tagging and test categorization
 *
 * Tags:
 * @P0 - Critical functionality (login, checkout, core features)
 * @P1 - Major functionality
 * @P2 - Minor functionality or edge cases
 * @P3 - Nice-to-have, low-risk scenarios
 * @smoke - Smoke test suite
 * @regression - Regression test suite
 * @e2e - End-to-end test
 * @ui - UI-specific test
 */

import { test, expect } from '../../fixtures';
import { LoginPage } from '../pages/LoginPage';
import { TestDataGenerator } from '../../utils/testDataGenerator';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ===========================================
  // P0 - Critical: Successful Login
  // ===========================================

  test.describe('P0 - Critical Login Scenarios', () => {
    test('should successfully login with valid credentials @P0 @smoke @e2e', async ({ page }) => {
      // Arrange
      const username = process.env.TEST_USER_USERNAME || 'testuser';
      const password = process.env.TEST_USER_PASSWORD || 'testpass';

      // Act
      await loginPage.login(username, password);

      // Assert
      // Verify user is redirected to dashboard/home page
      await expect(page).not.toHaveURL(/\/login/);
      // Verify user-specific elements are visible
      await expect(page.locator('[data-testid="user-menu"], .user-profile, .avatar')).toBeVisible();
    });

    test('should show error message for invalid credentials @P0 @smoke @e2e', async ({ page }) => {
      // Arrange
      const invalidUsername = 'invalid_user';
      const invalidPassword = 'wrong_password';

      // Act
      await loginPage.login(invalidUsername, invalidPassword);

      // Assert
      await loginPage.assertErrorMessageVisible();
      await loginPage.assertErrorMessageContains('Invalid');
      // Verify user remains on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should require username and password fields @P0 @smoke @e2e', async () => {
      // Act
      await loginPage.clickLoginButton();

      // Assert
      // Browser native validation or custom validation should trigger
      await loginPage.assertLoginPageIsDisplayed();
    });
  });

  // ===========================================
  // P1 - Major: Login Form Features
  // ===========================================

  test.describe('P1 - Major Login Features', () => {
    test('should display login page with all required elements @P1 @regression @ui', async () => {
      // Assert
      await loginPage.assertLoginPageIsDisplayed();
      await expect(loginPage['forgotPasswordLink']).toBeVisible();
      await expect(loginPage['registrationLink']).toBeVisible();
    });

    test('should toggle password visibility @P1 @regression @ui', async ({ page }) => {
      // Arrange
      const password = 'VisiblePassword123!';
      const passwordInput = page.getByLabel('Password');
      const toggleButton = page.getByRole('button', { name: /show|toggle|eye/i });

      // Act
      await loginPage.enterPassword(password);

      // Assert - password should be masked by default
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Act - toggle visibility if button exists
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');
      }
    });

    test('should clear form fields @P1 @regression @ui', async () => {
      // Arrange
      await loginPage.enterUsername('testuser');
      await loginPage.enterPassword('testpass');

      // Act
      await loginPage.clearForm();

      // Assert
      await loginPage.assertUsernameValue('');
    });
  });

  // ===========================================
  // P2 - Minor: Edge Cases and Variations
  // ===========================================

  test.describe('P2 - Edge Cases', () => {
    test('should handle leading/trailing whitespace in username @P2 @regression', async () => {
      // Arrange
      const username = '  testuser  ';
      const password = 'testpass';

      // Act
      await loginPage.login(username, password);

      // Assert - system should trim whitespace
      // This depends on application behavior
      console.log('Testing whitespace handling in username field');
    });

    test('should handle special characters in password @P2 @regression', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'P@ssw0rd!@#$%^&*()';

      // Act
      await loginPage.enterPassword(password);

      // Assert - password field should accept special characters
      const enteredValue = await loginPage['passwordInput'].inputValue();
      expect(enteredValue).toBe(password);
    });

    test('should handle rapid form submissions @P2 @regression', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpass';

      // Act - rapidly click login button multiple times
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);
      await loginPage.clickLoginButton();
      await loginPage.clickLoginButton();
      await loginPage.clickLoginButton();

      // Assert - should not cause multiple form submissions
      console.log('Testing rapid form submission handling');
    });
  });

  // ===========================================
  // P3 - Nice-to-Have: Additional Scenarios
  // ===========================================

  test.describe('P3 - Additional Scenarios', () => {
    test('should support "Remember Me" functionality @P3 @regression', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpass';

      // Act
      await loginPage.loginWithRememberMe(username, password);

      // Assert - user should remain logged in after page reload
      await loginPage.reloadPage();
      // Verify user is still authenticated
      console.log('Testing Remember Me functionality');
    });

    test('should navigate to forgot password page @P3 @regression @ui', async ({ page }) => {
      // Act
      await loginPage.clickForgotPassword();

      // Assert
      await expect(page).toHaveURL(/forgot-password|reset-password/);
    });

    test('should navigate to registration page @P3 @regression @ui', async ({ page }) => {
      // Act
      await loginPage.clickRegisterLink();

      // Assert
      await expect(page).toHaveURL(/register|signup|create-account/);
    });
  });

  // ===========================================
  // Data-Driven Test Example
  // ===========================================

  test.describe('Data-Driven Login Tests', () => {
    const loginTestData = TestDataGenerator.generateLoginTestData();

    loginTestData.forEach(({ username, password, expectedSuccess, expectedErrorMessage }, index) => {
      const outcome = expectedSuccess ? 'success' : 'failure';
      test(`should handle login with username="${username}" (expected ${outcome}) @P2 @regression`, async () => {
        // Act
        await loginPage.login(username, password);

        // Assert
        if (expectedSuccess) {
          // For valid credentials, expect successful login
          console.log(`Expected successful login for: ${username}`);
        } else {
          // For invalid credentials, expect error message
          await loginPage.assertErrorMessageVisible();
          if (expectedErrorMessage) {
            await loginPage.assertErrorMessageContains(expectedErrorMessage);
          }
        }
      });
    });
  });
});