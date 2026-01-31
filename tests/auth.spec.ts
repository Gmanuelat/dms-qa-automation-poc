/**
 * Authentication Test Suite
 *
 * Tests login functionality, including:
 * - Valid login scenarios
 * - Invalid credentials
 * - Form validation
 * - Session management
 *
 * Test Organization:
 * - Uses Playwright's describe/test structure
 * - Follows AAA pattern (Arrange, Act, Assert)
 * - Independent tests (no dependencies between tests)
 */

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users, errorMessages } from "../utils/testData";

/**
 * Test Suite: User Authentication
 *
 * Why use describe blocks?
 * - Groups related tests together
 * - Makes test reports more readable
 * - Allows shared setup/teardown via beforeEach/afterEach
 */
test.describe("User Authentication", () => {
  /**
   * beforeEach hook runs BEFORE every test in this describe block
   *
   * Why use beforeEach?
   * - Ensures consistent starting state
   * - Reduces code duplication
   * - Makes tests independent (each test starts fresh)
   */
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ====================
  // Positive Test Cases
  // ====================

  /**
   * Test: Successful login with valid credentials
   *
   * Business Requirement:
   * Users should be able to log in with correct username/password
   *
   * Test Steps:
   * 1. Navigate to login page (done in beforeEach)
   * 2. Enter valid credentials
   * 3. Click login button
   * 4. Verify successful login (logout button appears)
   */
  test("should successfully login with valid credentials", async ({ page }) => {
    // Arrange - Create page object instance
    const loginPage = new LoginPage(page);

    // Act - Perform login
    await loginPage.login(users.validUser.username, users.validUser.password);

    // Assert - Verify user is logged in
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    // Additional assertion: URL should no longer contain "/login"
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).not.toContain("/login");
  });

  /**
   * Test: Login with "Remember Me" option
   *
   * Tests the "Remember Me" checkbox functionality
   * In a real app, you'd verify cookies/localStorage after this
   */
  test("should login successfully with Remember Me checked", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Act - Login with Remember Me
    await loginPage.loginWithRememberMe(
      users.validUser.username,
      users.validUser.password
    );

    // Assert - Verify login succeeded
    expect(await loginPage.isLoggedIn()).toBe(true);

    // In a real test, you might verify:
    // - Cookie persistence
    // - localStorage tokens
    // - Session duration
  });

  // ====================
  // Negative Test Cases
  // ====================

  /**
   * Test: Login fails with invalid credentials
   *
   * Security Requirement:
   * System should reject invalid username/password combinations
   *
   * Expected Behavior:
   * - Error message displayed
   * - User remains on login page
   * - No session created
   */
  test("should show error message with invalid credentials", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Act - Attempt login with invalid credentials
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password
    );

    // Assert - Error message should appear
    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);

    // Verify error message text (if your app has specific error messages)
    // const errorText = await loginPage.getErrorMessage();
    // expect(errorText).toContain("Invalid username or password");

    // Assert - User should still be on login page
    expect(await loginPage.isOnLoginPage()).toBe(true);

    // Assert - User should NOT be logged in
    expect(await loginPage.isLoggedIn()).toBe(false);
  });

  /**
   * Test: Empty username validation
   *
   * Form Validation Requirement:
   * Username field should be required
   */
  test("should show validation error for empty username", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Act - Enter password only, leave username empty
    await loginPage.enterPassword(users.validUser.password);
    await loginPage.clickLogin();

    // Assert - Validation error should appear
    // Note: Actual selectors depend on your app's validation implementation
    // This is a placeholder - adjust based on real app behavior

    // Option 1: Check for general error message
    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);

    // Option 2: Check for field-specific error (if app supports)
    // const usernameError = await loginPage.getUsernameError();
    // expect(usernameError).toContain("required");

    // Assert - Login button might be disabled
    // (depends on your app's validation strategy)
  });

  /**
   * Test: Empty password validation
   *
   * Form Validation Requirement:
   * Password field should be required
   */
  test("should show validation error for empty password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Act - Enter username only, leave password empty
    await loginPage.enterUsername(users.validUser.username);
    await loginPage.clickLogin();

    // Assert - Validation error should appear
    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);

    // Option: Check for field-specific error
    // const passwordError = await loginPage.getPasswordError();
    // expect(passwordError).toContain("required");
  });

  /**
   * Test: Empty form submission
   *
   * Form Validation Requirement:
   * Both fields should be required
   */
  test("should show validation errors for empty form submission", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Act - Click login without entering any data
    await loginPage.clickLogin();

    // Assert - Error should be displayed
    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).toBe(true);

    // Assert - Should remain on login page
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  // ====================
  // Session Management Tests
  // ====================

  /**
   * Test: Logout functionality
   *
   * Business Requirement:
   * Users should be able to log out and end their session
   *
   * Note: This test requires valid login first
   */
  test("should successfully logout after login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange - Login first (prerequisite)
    await loginPage.login(users.validUser.username, users.validUser.password);
    expect(await loginPage.isLoggedIn()).toBe(true);

    // Act - Perform logout
    await loginPage.logout();

    // Assert - User should be logged out
    expect(await loginPage.isLoggedIn()).toBe(false);

    // Assert - Should be redirected to login page
    expect(await loginPage.isOnLoginPage()).toBe(true);

    // In a real app, you might also verify:
    // - Session cookies removed
    // - Auth tokens cleared
    // - Cannot access protected pages
  });

  // ====================
  // UI State Tests
  // ====================

  /**
   * Test: Form field persistence
   *
   * UX Requirement:
   * Username should persist after failed login attempt
   * (common UX pattern - helps users correct typos)
   */
  test("should retain username after failed login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Act - Attempt login with invalid password
    await loginPage.login(
      users.validUser.username,
      users.invalidUser.password
    );

    // Assert - Error should appear
    expect(await loginPage.hasErrorMessage()).toBe(true);

    // Assert - Username should still be populated
    const usernameValue = await loginPage.getUsernameValue();
    expect(usernameValue).toBe(users.validUser.username);

    // Note: Password field should be cleared for security
    // const passwordValue = await loginPage.getPasswordValue();
    // expect(passwordValue).toBe("");
  });

  /**
   * Test: Login button state
   *
   * Accessibility Requirement:
   * Login button should be enabled by default
   */
  test("should have login button enabled by default", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Assert - Button should be enabled
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(true);
  });

  // ====================
  // Security Tests
  // ====================

  /**
   * Test: SQL Injection attempt (security testing)
   *
   * Security Requirement:
   * System should safely handle malicious input
   *
   * Note: This is a basic security test - real security testing is more comprehensive
   */
  test("should safely handle SQL injection attempts", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Act - Attempt SQL injection in username field
    const sqlInjectionPayload = "' OR '1'='1";
    await loginPage.login(sqlInjectionPayload, "password");

    // Assert - Should show error, NOT grant access
    expect(await loginPage.hasErrorMessage()).toBe(true);
    expect(await loginPage.isLoggedIn()).toBe(false);

    // This proves the backend is properly sanitizing inputs
  });

  /**
   * Test: XSS attempt (Cross-Site Scripting)
   *
   * Security Requirement:
   * System should escape/sanitize script tags
   */
  test("should safely handle XSS attempts", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Act - Attempt XSS in username field
    const xssPayload = "<script>alert('XSS')</script>";
    await loginPage.login(xssPayload, "password");

    // Assert - Should show error, NOT execute script
    expect(await loginPage.hasErrorMessage()).toBe(true);

    // In a real test, you'd also verify no alert appeared
    // and the script tag is escaped in the DOM
  });
});

/**
 * Test Organization Best Practices:
 *
 * 1. Test Independence
 *    - Each test can run alone
 *    - No shared state between tests
 *    - beforeEach ensures clean state
 *
 * 2. Descriptive Names
 *    - Test names describe WHAT is being tested
 *    - Easy to understand test failures
 *    - Self-documenting test suite
 *
 * 3. AAA Pattern (Arrange-Act-Assert)
 *    - Arrange: Set up test data/state
 *    - Act: Perform the action being tested
 *    - Assert: Verify expected outcome
 *
 * 4. Comments
 *    - Explain WHY, not WHAT (code shows what)
 *    - Business requirements documented
 *    - Expected behavior clearly stated
 *
 * 5. Coverage
 *    - Positive cases (happy path)
 *    - Negative cases (error handling)
 *    - Edge cases (empty inputs, special chars)
 *    - Security tests (injection attempts)
 */
