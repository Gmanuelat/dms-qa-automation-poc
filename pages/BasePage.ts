/**
 * Base Page Object
 *
 * Parent class for all Page Objects.
 * Contains common functionality shared across all pages.
 *
 * Why use a BasePage?
 * 1. DRY Principle - Don't Repeat Yourself
 * 2. Common methods (navigate, wait, screenshot) defined once
 * 3. Easy to add global functionality (error handling, logging, etc.)
 * 4. Demonstrates OOP principles (inheritance, encapsulation)
 */

import { Page, Locator } from "@playwright/test";

export abstract class BasePage {
  // Protected: accessible by child classes (LoginPage, etc.) but not outside
  protected readonly page: Page;

  // Each page defines its own URL path
  protected abstract readonly path: string;

  /**
   * Constructor
   * @param page - Playwright Page instance (injected by tests)
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ====================
  // Navigation Methods
  // ====================

  /**
   * Navigate to this page using the path defined by child class
   *
   * Uses baseURL from playwright.config.ts
   * Example: If baseURL = "https://dms.example.com" and path = "/login"
   *          navigates to "https://dms.example.com/login"
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.path);
  }

  /**
   * Navigate to a specific URL (override for special cases)
   * @param url - Full URL or relative path
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Reload the current page
   * Useful for testing data refresh scenarios
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   * Useful for navigation flow testing
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  // ====================
  // Wait/Verification Methods
  // ====================

  /**
   * Wait for page to fully load (networkidle state)
   * Use after form submissions or navigation
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for a specific element to be visible
   * @param locator - Playwright locator
   * @param timeout - Optional custom timeout (ms)
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for a specific element to disappear
   * Useful for loading spinners, modals, etc.
   * @param locator - Playwright locator
   * @param timeout - Optional custom timeout (ms)
   */
  async waitForElementToDisappear(
    locator: Locator,
    timeout?: number
  ): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  /**
   * Check if an element is visible on the page
   * @param locator - Playwright locator
   * @returns true if visible, false otherwise
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current page URL
   * Useful for verifying navigation
   * @returns Current URL string
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   * Useful for verifying page identity
   * @returns Page title string
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // ====================
  // Interaction Methods
  // ====================

  /**
   * Click an element with automatic wait
   * @param locator - Playwright locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill a text input field
   * Automatically clears existing value first
   * @param locator - Playwright locator
   * @param text - Text to enter
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Select from a dropdown by visible text
   * @param locator - Playwright locator (select element)
   * @param value - Option value or visible text
   */
  async selectDropdown(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Check a checkbox (if not already checked)
   * @param locator - Playwright locator
   */
  async check(locator: Locator): Promise<void> {
    await locator.check();
  }

  /**
   * Uncheck a checkbox (if currently checked)
   * @param locator - Playwright locator
   */
  async uncheck(locator: Locator): Promise<void> {
    await locator.uncheck();
  }

  /**
   * Get text content from an element
   * @param locator - Playwright locator
   * @returns Text content as string
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || "";
  }

  /**
   * Get value from an input field
   * @param locator - Playwright locator
   * @returns Input value as string
   */
  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  // ====================
  // Utility Methods
  // ====================

  /**
   * Take a screenshot
   * @param name - Screenshot filename (without extension)
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Pause test execution (for debugging)
   * Opens Playwright Inspector
   * REMOVE before committing tests!
   */
  async pause(): Promise<void> {
    await this.page.pause();
  }

  /**
   * Execute custom JavaScript in the page context
   * Use sparingly - prefer Playwright's built-in methods
   *
   * @param script - JavaScript code to execute
   * @returns Result of script execution
   */
  async executeScript<T>(script: string): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Scroll to an element
   * Useful for lazy-loaded content or long pages
   * @param locator - Playwright locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Hover over an element
   * Useful for dropdown menus, tooltips
   * @param locator - Playwright locator
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Press a keyboard key
   * @param key - Key name (e.g., "Enter", "Escape", "Tab")
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for a specific amount of time
   * USE SPARINGLY - prefer waitForElement() instead
   *
   * @param milliseconds - Time to wait
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  // ====================
  // Validation Helpers
  // ====================

  /**
   * Verify page URL contains expected path
   * @param expectedPath - Partial URL to verify
   * @returns true if URL contains path, false otherwise
   */
  async urlContains(expectedPath: string): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes(expectedPath);
  }

  /**
   * Verify page title matches expected value
   * @param expectedTitle - Expected page title
   * @returns true if title matches, false otherwise
   */
  async titleEquals(expectedTitle: string): Promise<boolean> {
    const title = await this.getPageTitle();
    return title === expectedTitle;
  }

  /**
   * Get count of elements matching a locator
   * Useful for verifying table rows, search results, etc.
   *
   * @param locator - Playwright locator
   * @returns Number of matching elements
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }
}
