/**
 * Login Page Object
 * Represents the login/authentication page of the application
 * Follows the Page Object Model (POM) design pattern
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  // ===========================================
  // Page Elements (Locators)
  // ===========================================

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly loginForm: Locator;
  private readonly pageTitle: Locator;
  private readonly registrationLink: Locator;

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);

    // Initialize locators
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /log in|sign in|login/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me|keep me signed in/i);
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password|reset password/i });
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.loginForm = page.locator('form');
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /login|sign in/i });
    this.registrationLink = page.getByRole('link', { name: /register|create account|sign up/i });
  }

  // ===========================================
  // Page Actions
  // ===========================================

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigateTo();
  }

  /**
   * Enter username into the username field
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password into the password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Perform a complete login action
   * @param username - User's username
   * @param password - User's password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * Perform login with "Remember Me" option
   */
  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.check(this.rememberMeCheckbox);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * Click the "Forgot Password" link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click the registration link
   */
  async clickRegisterLink(): Promise<void> {
    await this.click(this.registrationLink);
  }

  /**
   * Clear all input fields on the login form
   */
  async clearForm(): Promise<void> {
    await this.fillInput(this.usernameInput, '');
    await this.fillInput(this.passwordInput, '');
  }

  /**
   * Submit the login form directly (without clicking button)
   */
  async submitForm(): Promise<void> {
    await this.pressKey('Enter');
    await this.waitForPageLoad();
  }

  // ===========================================
  // Assertion Methods
  // ===========================================

  /**
   * Assert that the login page is displayed
   */
  async assertLoginPageIsDisplayed(): Promise<void> {
    await this.assertElementVisible(this.loginForm);
    await this.assertElementVisible(this.usernameInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
  }

  /**
   * Assert that an error message is displayed
   */
  async assertErrorMessageVisible(): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Assert that a specific error message is shown
   */
  async assertErrorMessageContains(expectedMessage: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
    await this.assertElementContainsText(this.errorMessage, expectedMessage);
  }

  /**
   * Assert that the login was successful (user is redirected)
   */
  async assertLoginSuccessful(expectedUrl?: string): Promise<void> {
    if (expectedUrl) {
      await this.assertPageUrl(expectedUrl);
    }
  }

  /**
   * Assert that the login button is disabled
   */
  async assertLoginButtonDisabled(): Promise<void> {
    await this.assertElementDisabled(this.loginButton);
  }

  /**
   * Assert that the login button is enabled
   */
  async assertLoginButtonEnabled(): Promise<void> {
    await this.assertElementEnabled(this.loginButton);
  }

  /**
   * Assert that the username field has a specific value
   */
  async assertUsernameValue(expectedValue: string): Promise<void> {
    const value = await this.getInputValue(this.usernameInput);
    expect(value).toBe(expectedValue);
  }

  /**
   * Assert that the "Remember Me" checkbox is checked
   */
  async assertRememberMeChecked(): Promise<void> {
    const isChecked = await this.isChecked(this.rememberMeCheckbox);
    expect(isChecked).toBe(true);
  }

  // ===========================================
  // Getter Methods
  // ===========================================

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /**
   * Get the current page title
   */
  async getLoginPageTitle(): Promise<string> {
    return this.getPageTitle();
  }
}