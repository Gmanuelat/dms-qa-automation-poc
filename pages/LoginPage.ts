/**
 * Login Page Object
 *
 * Represents the DMS login page and all its interactions.
 *
 * Responsibilities:
 * - User authentication (login/logout)
 * - Form validation testing
 * - Error message verification
 *
 * Why separate LoginPage from BasePage?
 * - Single Responsibility Principle (SRP)
 * - LoginPage handles ONLY login-specific logic
 * - Makes tests more readable and maintainable
 */

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Page path (appended to baseURL from config)
  protected readonly path = "/login";

  // ====================
  // Locators (Element Selectors)
  // ====================
  // Why define locators as properties?
  // 1. Single source of truth - if UI changes, update once
  // 2. Descriptive names make test code readable
  // 3. Can be reused across multiple methods

  // Input fields
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;

  // Buttons
  private readonly loginButton: Locator;
  private readonly logoutButton: Locator;

  // Messages and alerts
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;

  // Form validation errors
  private readonly usernameError: Locator;
  private readonly passwordError: Locator;

  // Other elements
  private readonly forgotPasswordLink: Locator;
  private readonly rememberMeCheckbox: Locator;

  /**
   * Constructor - Initializes all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page); // Call BasePage constructor

    // Initialize locators
    // NOTE: These are placeholder selectors - in a real app, you'd inspect the DOM
    // and use actual IDs, test-ids, or stable selectors

    this.usernameInput = this.page.locator('input[name="username"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.loginButton = this.page.locator('button[type="submit"]');
    this.logoutButton = this.page.locator('button:has-text("Logout")');

    // Error messages - adjust selectors based on actual app structure
    this.errorMessage = this.page.locator('.error-message, .alert-danger');
    this.successMessage = this.page.locator('.success-message, .alert-success');

    // Field-specific validation errors
    this.usernameError = this.page.locator('#username-error, [data-testid="username-error"]');
    this.passwordError = this.page.locator('#password-error, [data-testid="password-error"]');

    // Additional form elements
    this.forgotPasswordLink = this.page.locator('a:has-text("Forgot Password")');
    this.rememberMeCheckbox = this.page.locator('input[name="rememberMe"]');
  }

  // ====================
  // Page Actions
  // ====================

  /**
   * Perform login with username and password
   *
   * This is the main action method - tests will call this instead of
   * manually filling fields and clicking buttons
   *
   * @param username - User email or username
   * @param password - User password
   *
   * Example usage in test:
   * const loginPage = new LoginPage(page);
   * await loginPage.navigate();
   * await loginPage.login("user@example.com", "password123");
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    // Wait for navigation to complete after login
    await this.waitForPageLoad();
  }

  /**
   * Perform login with "Remember Me" option checked
   * Demonstrates testing different login scenarios
   *
   * @param username - User email or username
   * @param password - User password
   */
  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.check(this.rememberMeCheckbox);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Enter username only (for testing validation)
   * @param username - User email or username
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Enter password only (for testing validation)
   * @param password - User password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click the login button
   * Useful for testing with empty/invalid inputs
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Click "Forgot Password" link
   * Useful for testing password recovery flow
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Perform logout
   * Assumes user is already logged in
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await this.waitForPageLoad();
  }

  // ====================
  // Verification Methods
  // ====================

  /**
   * Check if error message is displayed
   * @returns true if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get the error message text
   * Useful for verifying specific error messages
   *
   * @returns Error message content
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if success message is displayed
   * @returns true if success message is visible
   */
  async hasSuccessMessage(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Get username field validation error
   * @returns Validation error text for username field
   */
  async getUsernameError(): Promise<string> {
    return await this.getText(this.usernameError);
  }

  /**
   * Get password field validation error
   * @returns Validation error text for password field
   */
  async getPasswordError(): Promise<string> {
    return await this.getText(this.passwordError);
  }

  /**
   * Verify user is on the login page
   * Checks URL contains "/login"
   *
   * @returns true if on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    return await this.urlContains("/login");
  }

  /**
   * Verify logout button is visible (user is logged in)
   * @returns true if logout button is visible
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.logoutButton);
  }

  /**
   * Verify login button is enabled
   * @returns true if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Verify "Remember Me" checkbox is checked
   * @returns true if checkbox is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  // ====================
  // Helper Methods
  // ====================

  /**
   * Clear all form fields
   * Useful for testing multiple login scenarios in sequence
   */
  async clearForm(): Promise<void> {
    await this.fill(this.usernameInput, "");
    await this.fill(this.passwordInput, "");
  }

  /**
   * Wait for error message to appear
   * Useful after submitting invalid credentials
   *
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForErrorMessage(timeout?: number): Promise<void> {
    await this.waitForElement(this.errorMessage, timeout);
  }

  /**
   * Wait for success message to appear
   * Useful after successful login
   *
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForSuccessMessage(timeout?: number): Promise<void> {
    await this.waitForElement(this.successMessage, timeout);
  }

  /**
   * Get the current value in the username field
   * Useful for verifying form persistence or autocomplete
   *
   * @returns Current username value
   */
  async getUsernameValue(): Promise<string> {
    return await this.getValue(this.usernameInput);
  }

  /**
   * Get the current value in the password field
   * Note: Most apps mask this, so it may return asterisks or empty
   *
   * @returns Current password value
   */
  async getPasswordValue(): Promise<string> {
    return await this.getValue(this.passwordInput);
  }
}
