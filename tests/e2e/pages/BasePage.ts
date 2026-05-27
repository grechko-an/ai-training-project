/**
 * Base Page Object class
 * Provides common methods and utilities for all page objects
 * Follows the Page Object Model (POM) design pattern
 */

import { Page, Locator, expect } from '@playwright/test';
import { WaitForOptions, NavigationOptions } from '../../types';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  /**
   * URL path for the page (relative to base URL)
   * Override in child classes
   */
  protected abstract readonly path: string;

  constructor(page: Page, baseUrl?: string) {
    this.page = page;
    this.baseUrl = baseUrl || process.env.BASE_URL || 'http://localhost:3000';
  }

  // ===========================================
  // Navigation Methods
  // ===========================================

  /**
   * Navigate to the page URL
   */
  async navigateTo(options?: NavigationOptions): Promise<void> {
    const url = `${this.baseUrl}${this.path}`;
    await this.page.goto(url, {
      timeout: options?.timeout || 30000,
      waitUntil: options?.waitUntil || 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a specific URL
   */
  async navigateToUrl(url: string, options?: NavigationOptions): Promise<void> {
    await this.page.goto(url, {
      timeout: options?.timeout || 30000,
      waitUntil: options?.waitUntil || 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload the current page
   */
  async reloadPage(options?: NavigationOptions): Promise<void> {
    await this.page.reload({
      timeout: options?.timeout || 30000,
      waitUntil: options?.waitUntil || 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  /**
   * Go back to the previous page
   */
  async goBack(options?: NavigationOptions): Promise<void> {
    await this.page.goBack({
      timeout: options?.timeout || 30000,
      waitUntil: options?.waitUntil || 'domcontentloaded',
    });
    await this.waitForPageLoad();
  }

  // ===========================================
  // Element Interaction Methods
  // ===========================================

  /**
   * Click on an element
   */
  async click(locator: Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.click({ force: options?.force });
  }

  /**
   * Fill a text input field
   */
  async fillInput(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Type text into an input field (character by character)
   */
  async typeText(locator: Locator, value: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.clear();
    await locator.type(value, { delay: options?.delay || 50 });
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(locator: Locator, value: string | string[], options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.selectOption(value);
  }

  /**
   * Check a checkbox or radio button
   */
  async check(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.uncheck();
  }

  /**
   * Hover over an element
   */
  async hover(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await locator.hover();
  }

  /**
   * Get text content from an element
   */
  async getText(locator: Locator, options?: { timeout?: number }): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return (await locator.textContent()) || '';
  }

  /**
   * Get input value from a field
   */
  async getInputValue(locator: Locator, options?: { timeout?: number }): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return await locator.inputValue();
  }

  /**
   * Get attribute value from an element
   */
  async getAttribute(locator: Locator, attributeName: string, options?: { timeout?: number }): Promise<string | null> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return await locator.getAttribute(attributeName);
  }

  /**
   * Check if an element is visible
   */
  async isVisible(locator: Locator, options?: { timeout?: number }): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: options?.timeout || 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is enabled
   */
  async isEnabled(locator: Locator, options?: { timeout?: number }): Promise<boolean> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return await locator.isEnabled();
  }

  /**
   * Check if an element is checked
   */
  async isChecked(locator: Locator, options?: { timeout?: number }): Promise<boolean> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return await locator.isChecked();
  }

  // ===========================================
  // Wait Methods
  // ===========================================

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded').catch(() => {
      // Fallback if networkidle times out
      console.warn('Network did not reach idle state, continuing...');
    });
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElementVisible(locator: Locator, options?: WaitForOptions): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: options?.timeout || 10000,
    });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, options?: WaitForOptions): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: options?.timeout || 10000,
    });
  }

  /**
   * Wait for a specific text to appear on the page
   */
  async waitForText(text: string, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForFunction(
      (expectedText: string) => document.body?.textContent?.includes(expectedText),
      text,
      { timeout: options?.timeout || 10000 }
    );
  }

  /**
   * Wait for a specific URL pattern
   */
  async waitForUrl(urlPattern: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: options?.timeout || 10000 });
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle(options?: { timeout?: number }): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: options?.timeout || 10000 });
  }

  // ===========================================
  // Assertion Methods
  // ===========================================

  /**
   * Assert that an element is visible
   */
  async assertElementVisible(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeVisible({ timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element is hidden
   */
  async assertElementHidden(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeHidden({ timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element contains specific text
   */
  async assertElementContainsText(locator: Locator, text: string, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toContainText(text, { timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element has exact text
   */
  async assertElementHasText(locator: Locator, text: string, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toHaveText(text, { timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element has a specific attribute value
   */
  async assertElementHasAttribute(locator: Locator, attributeName: string, value: string, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toHaveAttribute(attributeName, value, { timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element is enabled
   */
  async assertElementEnabled(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeEnabled({ timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that an element is disabled
   */
  async assertElementDisabled(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeDisabled({ timeout: options?.timeout || 10000 });
  }

  /**
   * Assert that the page has a specific title
   */
  async assertPageTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Assert that the page URL matches a pattern
   */
  async assertPageUrl(urlPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }

  // ===========================================
  // Utility Methods
  // ===========================================

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(fileName?: string): Promise<Buffer> {
    const screenshotName = fileName || `screenshot-${Date.now()}.png`;
    return await this.page.screenshot({ path: `./test-results/screenshots/${screenshotName}`, fullPage: true });
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Press a keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Scroll to an element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Execute JavaScript on the page
   */
  async evaluate<T>(fn: () => T): Promise<T> {
    return await this.page.evaluate(fn);
  }

  /**
   * Get a locator by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get a locator by role
   */
  getByRole(role: string, options?: { name?: string; exact?: boolean }): Locator {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Get a locator by text
   */
  getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  /**
   * Get a locator by label
   */
  getByLabel(label: string, options?: { exact?: boolean }): Locator {
    return this.page.getByLabel(label, options);
  }

  /**
   * Get a locator by placeholder
   */
  getByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Get a locator by CSS selector
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}