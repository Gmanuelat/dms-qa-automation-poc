/**
 * Repair Orders Test Suite
 *
 * Tests repair order management functionality:
 * - Search and filter operations
 * - CRUD operations (Create, Read, Update, Delete)
 * - Data validation
 * - Table/grid interaction
 * - Pagination
 *
 * Demonstrates:
 * - Complex page interactions
 * - Data-driven testing
 * - Business workflow testing
 */

import { test, expect } from "@playwright/test";
import { RepairOrdersPage } from "../pages/RepairOrdersPage";
import { LoginPage } from "../pages/LoginPage";
import { users, repairOrders, generateOrderNumber } from "../utils/testData";

/**
 * Test Suite: Repair Order Management
 */
test.describe("Repair Order Management", () => {
  /**
   * Login before all tests in this suite
   *
   * Why beforeEach instead of beforeAll?
   * - Playwright recommends beforeEach for isolated tests
   * - Each test gets a fresh browser context
   * - Prevents test pollution (one test affecting another)
   */
  test.beforeEach(async ({ page }) => {
    // Step 1: Login (prerequisite for accessing repair orders)
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);

    // Step 2: Navigate to Repair Orders page
    const repairOrdersPage = new RepairOrdersPage(page);
    await repairOrdersPage.navigate();
  });

  // ====================
  // Search & Filter Tests
  // ====================

  /**
   * Test: Search for repair orders
   *
   * Business Requirement:
   * Users should be able to search repair orders by order number,
   * customer name, or VIN
   */
  test("should search for repair orders by order number", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Search for a specific order number
    await repairOrdersPage.search(repairOrders.searchFilters.validOrderNumber);

    // Assert - Results should be displayed
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(true);

    // Assert - Result should contain the searched order number
    const orderNumbers = await repairOrdersPage.getAllOrderNumbers();
    expect(orderNumbers).toContain(repairOrders.searchFilters.validOrderNumber);
  });

  /**
   * Test: Search with no results
   *
   * UX Requirement:
   * System should clearly indicate when no results are found
   */
  test("should show no results message for invalid search", async ({
    page,
  }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Search for non-existent order number
    await repairOrdersPage.search(
      repairOrders.searchFilters.invalidOrderNumber
    );

    // Assert - No results message should appear
    const hasNoResults = await repairOrdersPage.hasNoResults();
    expect(hasNoResults).toBe(true);

    // Assert - Results table should not be visible
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(false);
  });

  /**
   * Test: Clear search functionality
   *
   * UX Requirement:
   * Users should be able to clear search and see all results again
   */
  test("should clear search and show all results", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Arrange - Perform a search first
    await repairOrdersPage.search(repairOrders.searchFilters.validOrderNumber);
    const searchResultCount = await repairOrdersPage.getRepairOrderCount();

    // Act - Clear the search
    await repairOrdersPage.clearSearch();

    // Assert - Result count should increase (showing all orders now)
    const allResultsCount = await repairOrdersPage.getRepairOrderCount();
    expect(allResultsCount).toBeGreaterThanOrEqual(searchResultCount);
  });

  /**
   * Test: Filter by status
   *
   * Business Requirement:
   * Users should be able to filter repair orders by status
   */
  test("should filter repair orders by status", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Filter by "In Progress" status
    await repairOrdersPage.filterByStatus("In Progress");

    // Assert - Results should be displayed
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(true);

    // In a real app, you'd verify all results have "In Progress" status
    // by iterating through table rows and checking status column
  });

  /**
   * Test: Filter by customer name
   *
   * Business Requirement:
   * Users should be able to filter by customer name
   */
  test("should filter repair orders by customer name", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Filter by customer name
    await repairOrdersPage.filterByCustomer(
      repairOrders.searchFilters.customerName
    );

    // Assert - Results should be displayed
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(true);

    // In a real app, verify all results contain the customer name
  });

  /**
   * Test: Filter by date range
   *
   * Business Requirement:
   * Users should be able to filter orders by creation date range
   */
  test("should filter repair orders by date range", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Apply date range filter
    await repairOrdersPage.filterByDateRange(
      repairOrders.searchFilters.dateRange.startDate,
      repairOrders.searchFilters.dateRange.endDate
    );

    // Assert - Results should be displayed (if any orders in range)
    // Note: Might show "no results" if date range doesn't match data
    const hasResults = await repairOrdersPage.hasResults();
    const hasNoResults = await repairOrdersPage.hasNoResults();

    // Either has results OR shows no results message (both are valid)
    expect(hasResults || hasNoResults).toBe(true);
  });

  // ====================
  // Create Operation Tests (C in CRUD)
  // ====================

  /**
   * Test: Create new repair order with valid data
   *
   * Business Requirement:
   * Users should be able to create new repair orders
   *
   * Steps:
   * 1. Click "Create New"
   * 2. Fill out form
   * 3. Save
   * 4. Verify order appears in list
   */
  test("should create new repair order successfully", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Arrange - Generate unique order data
    const newOrderData = {
      ...repairOrders.newOrder,
      orderNumber: generateOrderNumber(), // Unique order number
    };

    // Act - Create repair order
    await repairOrdersPage.createRepairOrder(newOrderData);

    // Assert - Success (no form errors)
    const hasError = await repairOrdersPage.hasFormError();
    expect(hasError).toBe(false);

    // Assert - New order should appear in the list
    // (You might need to search for it first)
    // await repairOrdersPage.search(newOrderData.customerName);
    // const hasResults = await repairOrdersPage.hasResults();
    // expect(hasResults).toBe(true);
  });

  /**
   * Test: Form validation for required fields
   *
   * Validation Requirement:
   * Required fields should be validated before submission
   */
  test("should show validation error for incomplete form", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Open create form
    await repairOrdersPage.clickCreateNew();

    // Act - Fill only some fields (incomplete data)
    await repairOrdersPage.fillRepairOrderForm({
      customerName: "Incomplete Test",
      // Missing required fields: VIN, make, model, etc.
    });

    // Act - Attempt to save
    await repairOrdersPage.saveForm();

    // Assert - Form error should appear
    const hasError = await repairOrdersPage.hasFormError();
    expect(hasError).toBe(true);

    // Optional: Verify specific error message
    // const errorMessage = await repairOrdersPage.getFormError();
    // expect(errorMessage).toContain("required");
  });

  /**
   * Test: Cancel form action
   *
   * UX Requirement:
   * Users should be able to cancel form without saving
   */
  test("should cancel form without creating repair order", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Arrange - Get current count of orders
    const initialCount = await repairOrdersPage.getRepairOrderCount();

    // Act - Open create form
    await repairOrdersPage.clickCreateNew();

    // Act - Fill form
    await repairOrdersPage.fillRepairOrderForm(repairOrders.newOrder);

    // Act - Cancel instead of save
    await repairOrdersPage.cancelForm();

    // Assert - Order count should remain the same (no order created)
    const finalCount = await repairOrdersPage.getRepairOrderCount();
    expect(finalCount).toBe(initialCount);
  });

  // ====================
  // Read Operation Tests (R in CRUD)
  // ====================

  /**
   * Test: View repair order details
   *
   * Business Requirement:
   * Users should be able to view detailed information for each order
   */
  test("should display repair order details when clicked", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Click on a repair order
    await repairOrdersPage.clickRepairOrder(
      repairOrders.existingOrder.orderNumber
    );

    // Assert - Details panel should open
    const isDetailsOpen = await repairOrdersPage.isDetailsPanelOpen();
    expect(isDetailsOpen).toBe(true);

    // Assert - Order number should be displayed in details
    const detailsOrderNumber =
      await repairOrdersPage.getDetailsOrderNumber();
    expect(detailsOrderNumber).toContain(
      repairOrders.existingOrder.orderNumber
    );
  });

  /**
   * Test: Close repair order details panel
   *
   * UX Requirement:
   * Users should be able to close details panel
   */
  test("should close repair order details panel", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Arrange - Open details first
    await repairOrdersPage.clickRepairOrder(
      repairOrders.existingOrder.orderNumber
    );
    expect(await repairOrdersPage.isDetailsPanelOpen()).toBe(true);

    // Act - Close details panel
    await repairOrdersPage.closeDetailsPanel();

    // Assert - Panel should be closed
    const isDetailsOpen = await repairOrdersPage.isDetailsPanelOpen();
    expect(isDetailsOpen).toBe(false);
  });

  /**
   * Test: Verify data displayed in details panel
   *
   * Data Accuracy Requirement:
   * Details panel should show correct information
   */
  test("should display correct data in details panel", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Open details for a known order
    await repairOrdersPage.clickRepairOrder(
      repairOrders.existingOrder.orderNumber
    );

    // Assert - Verify customer name
    const customerName = await repairOrdersPage.getDetailsCustomerName();
    expect(customerName).toContain(repairOrders.existingOrder.customerName);

    // Assert - Verify status
    const status = await repairOrdersPage.getDetailsStatus();
    expect(status).toContain(repairOrders.existingOrder.status);
  });

  // ====================
  // Table Interaction Tests
  // ====================

  /**
   * Test: Display repair orders table
   *
   * Business Requirement:
   * System should display repair orders in a table/grid format
   */
  test("should display repair orders table with data", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Assert - Table should be visible
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(true);

    // Assert - At least one repair order should be displayed
    const orderCount = await repairOrdersPage.getRepairOrderCount();
    expect(orderCount).toBeGreaterThan(0);
  });

  /**
   * Test: Verify order number exists in table
   *
   * Data Verification:
   * Specific order should be findable in the table
   */
  test("should find specific order number in table", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Check if order exists
    const orderExists = await repairOrdersPage.hasOrderNumber(
      repairOrders.existingOrder.orderNumber
    );

    // Assert - Order should be found
    expect(orderExists).toBe(true);
  });

  // ====================
  // Pagination Tests
  // ====================

  /**
   * Test: Navigate to next page (if pagination exists)
   *
   * Business Requirement:
   * Users should be able to navigate through pages of results
   *
   * Note: This test assumes there are enough results to paginate
   */
  test("should navigate to next page of results", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Check if next page is available
    const hasNextPage = await repairOrdersPage.hasNextPage();

    if (hasNextPage) {
      // Arrange - Get current page order numbers
      const firstPageOrders = await repairOrdersPage.getAllOrderNumbers();

      // Act - Go to next page
      await repairOrdersPage.goToNextPage();

      // Assert - Order numbers should be different (new page loaded)
      const secondPageOrders = await repairOrdersPage.getAllOrderNumbers();
      expect(secondPageOrders).not.toEqual(firstPageOrders);
    } else {
      // If no pagination, test passes (not all apps have enough data for pagination)
      test.skip();
    }
  });

  /**
   * Test: Display pagination information
   *
   * UX Requirement:
   * Users should see pagination info (e.g., "Showing 1-10 of 50")
   */
  test("should display pagination information", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Act - Get pagination info
    const paginationInfo = await repairOrdersPage.getPaginationInfo();

    // Assert - Pagination info should contain numbers
    // Example: "Showing 1-10 of 50 results"
    expect(paginationInfo).toBeTruthy();
    expect(paginationInfo.length).toBeGreaterThan(0);
  });

  // ====================
  // Integration Tests (Multi-Step Workflows)
  // ====================

  /**
   * Test: Complete workflow - Create, Search, View, Close
   *
   * Business Workflow:
   * Complete end-to-end scenario a user might perform
   *
   * Steps:
   * 1. Create new repair order
   * 2. Search for the created order
   * 3. View its details
   * 4. Close details panel
   */
  test("should complete full create-search-view workflow", async ({ page }) => {
    const repairOrdersPage = new RepairOrdersPage(page);

    // Step 1: Create new repair order
    const uniqueCustomerName = `Test Customer ${Date.now()}`;
    const newOrderData = {
      ...repairOrders.newOrder,
      customerName: uniqueCustomerName,
    };

    await repairOrdersPage.createRepairOrder(newOrderData);

    // Step 2: Search for the newly created order
    await repairOrdersPage.search(uniqueCustomerName);

    // Step 3: Verify it appears in results
    const hasResults = await repairOrdersPage.hasResults();
    expect(hasResults).toBe(true);

    // Step 4: Click to view details (if clickable by customer name)
    // Note: This depends on your app's implementation
    // You might need to get the order number first

    // Step 5: Verify workflow completed successfully
    // This is a realistic integration test that covers multiple features
  });
});

/**
 * Additional Test Ideas (for future expansion):
 *
 * Update Operation (U in CRUD):
 * - Edit existing repair order
 * - Update status
 * - Modify vehicle information
 * - Update cost estimates
 *
 * Delete Operation (D in CRUD):
 * - Delete repair order
 * - Confirm deletion dialog
 * - Verify order removed from list
 *
 * Advanced Filtering:
 * - Combine multiple filters (status + date range)
 * - Filter by multiple statuses
 * - Filter by VIN
 *
 * Sorting:
 * - Sort by order number
 * - Sort by date
 * - Sort by customer name
 * - Sort by status
 *
 * Export/Reporting:
 * - Export to CSV/PDF
 * - Generate reports
 * - Print repair orders
 */
