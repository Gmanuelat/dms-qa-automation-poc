/**
 * Repair Orders Page Object
 *
 * Represents the DMS Repair Orders management page.
 *
 * Responsibilities:
 * - Search and filter repair orders
 * - View repair order details
 * - Create new repair orders
 * - Update existing repair orders
 * - Table/grid interaction
 *
 * Demonstrates:
 * - Complex page interactions (search, filters, tables)
 * - CRUD operations (Create, Read, Update, Delete)
 * - Data validation
 */

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RepairOrdersPage extends BasePage {
  protected readonly path = "/repair-orders";

  // ====================
  // Locators - Search & Filters
  // ====================

  // Search bar
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly clearSearchButton: Locator;

  // Filter dropdowns
  private readonly statusFilter: Locator;
  private readonly dateRangeFilter: Locator;
  private readonly customerFilter: Locator;

  // Date picker inputs (for date range filter)
  private readonly startDateInput: Locator;
  private readonly endDateInput: Locator;

  // ====================
  // Locators - Table/Grid
  // ====================

  // Table elements
  private readonly resultsTable: Locator;
  private readonly tableRows: Locator;
  private readonly tableHeaders: Locator;

  // Table columns (by index or name)
  private readonly orderNumberColumn: Locator;
  private readonly customerNameColumn: Locator;
  private readonly statusColumn: Locator;
  private readonly dateColumn: Locator;

  // Pagination
  private readonly nextPageButton: Locator;
  private readonly previousPageButton: Locator;
  private readonly pageInfo: Locator; // "Showing 1-10 of 50"

  // No results message
  private readonly noResultsMessage: Locator;

  // ====================
  // Locators - Create/Edit Form
  // ====================

  // Buttons
  private readonly createNewButton: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly deleteButton: Locator;

  // Form fields (for creating/editing repair orders)
  private readonly customerNameInput: Locator;
  private readonly vehicleVinInput: Locator;
  private readonly vehicleMakeInput: Locator;
  private readonly vehicleModelInput: Locator;
  private readonly vehicleYearInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly estimatedCostInput: Locator;
  private readonly statusDropdown: Locator;

  // Form validation errors
  private readonly formErrorMessage: Locator;

  // ====================
  // Locators - Details View
  // ====================

  // Detail panel elements
  private readonly detailsPanel: Locator;
  private readonly detailsOrderNumber: Locator;
  private readonly detailsCustomerName: Locator;
  private readonly detailsVehicleInfo: Locator;
  private readonly detailsStatus: Locator;
  private readonly detailsDescription: Locator;
  private readonly closeDetailsButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize search/filter locators
    this.searchInput = this.page.locator('input[placeholder*="Search"], #search-input');
    this.searchButton = this.page.locator('button:has-text("Search"), button[type="submit"]');
    this.clearSearchButton = this.page.locator('button:has-text("Clear")');

    this.statusFilter = this.page.locator('select[name="status"], #status-filter');
    this.dateRangeFilter = this.page.locator('select[name="dateRange"]');
    this.customerFilter = this.page.locator('input[name="customer"]');

    this.startDateInput = this.page.locator('input[name="startDate"], #start-date');
    this.endDateInput = this.page.locator('input[name="endDate"], #end-date');

    // Initialize table locators
    this.resultsTable = this.page.locator('table, [role="table"], .results-table');
    this.tableRows = this.resultsTable.locator('tbody tr, [role="row"]');
    this.tableHeaders = this.resultsTable.locator('thead th, [role="columnheader"]');

    // Column locators (adjust based on actual table structure)
    this.orderNumberColumn = this.page.locator('td:nth-child(1), [data-column="orderNumber"]');
    this.customerNameColumn = this.page.locator('td:nth-child(2), [data-column="customerName"]');
    this.statusColumn = this.page.locator('td:nth-child(3), [data-column="status"]');
    this.dateColumn = this.page.locator('td:nth-child(4), [data-column="date"]');

    // Pagination locators
    this.nextPageButton = this.page.locator('button:has-text("Next"), .pagination-next');
    this.previousPageButton = this.page.locator('button:has-text("Previous"), .pagination-prev');
    this.pageInfo = this.page.locator('.pagination-info, .page-info');

    this.noResultsMessage = this.page.locator('.no-results, .empty-state, :has-text("No repair orders found")');

    // Initialize form locators
    this.createNewButton = this.page.locator('button:has-text("Create New"), button:has-text("New Repair Order")');
    this.saveButton = this.page.locator('button:has-text("Save"), button[type="submit"]');
    this.cancelButton = this.page.locator('button:has-text("Cancel")');
    this.deleteButton = this.page.locator('button:has-text("Delete")');

    this.customerNameInput = this.page.locator('input[name="customerName"]');
    this.vehicleVinInput = this.page.locator('input[name="vehicleVin"]');
    this.vehicleMakeInput = this.page.locator('input[name="vehicleMake"]');
    this.vehicleModelInput = this.page.locator('input[name="vehicleModel"]');
    this.vehicleYearInput = this.page.locator('input[name="vehicleYear"]');
    this.descriptionInput = this.page.locator('textarea[name="description"]');
    this.estimatedCostInput = this.page.locator('input[name="estimatedCost"]');
    this.statusDropdown = this.page.locator('select[name="status"]');

    this.formErrorMessage = this.page.locator('.form-error, .alert-danger');

    // Initialize details panel locators
    this.detailsPanel = this.page.locator('.details-panel, .modal, [role="dialog"]');
    this.detailsOrderNumber = this.detailsPanel.locator('.order-number, [data-field="orderNumber"]');
    this.detailsCustomerName = this.detailsPanel.locator('.customer-name, [data-field="customerName"]');
    this.detailsVehicleInfo = this.detailsPanel.locator('.vehicle-info, [data-field="vehicleInfo"]');
    this.detailsStatus = this.detailsPanel.locator('.status, [data-field="status"]');
    this.detailsDescription = this.detailsPanel.locator('.description, [data-field="description"]');
    this.closeDetailsButton = this.detailsPanel.locator('button:has-text("Close"), .close-button');
  }

  // ====================
  // Search & Filter Actions
  // ====================

  /**
   * Search for repair orders by keyword
   * @param searchTerm - Order number, customer name, VIN, etc.
   */
  async search(searchTerm: string): Promise<void> {
    await this.fill(this.searchInput, searchTerm);
    await this.click(this.searchButton);
    await this.waitForPageLoad();
  }

  /**
   * Clear current search
   */
  async clearSearch(): Promise<void> {
    await this.click(this.clearSearchButton);
    await this.waitForPageLoad();
  }

  /**
   * Filter repair orders by status
   * @param status - Status value (e.g., "In Progress", "Completed")
   */
  async filterByStatus(status: string): Promise<void> {
    await this.selectDropdown(this.statusFilter, status);
    await this.waitForPageLoad();
  }

  /**
   * Filter repair orders by date range
   * @param startDate - Start date (YYYY-MM-DD format)
   * @param endDate - End date (YYYY-MM-DD format)
   */
  async filterByDateRange(startDate: string, endDate: string): Promise<void> {
    await this.fill(this.startDateInput, startDate);
    await this.fill(this.endDateInput, endDate);
    await this.waitForPageLoad();
  }

  /**
   * Filter repair orders by customer name
   * @param customerName - Full or partial customer name
   */
  async filterByCustomer(customerName: string): Promise<void> {
    await this.fill(this.customerFilter, customerName);
    await this.waitForPageLoad();
  }

  // ====================
  // Table Interaction Methods
  // ====================

  /**
   * Get the number of repair orders displayed in the table
   * @returns Count of table rows
   */
  async getRepairOrderCount(): Promise<number> {
    return await this.getElementCount(this.tableRows);
  }

  /**
   * Check if results table is visible
   * @returns true if table is displayed
   */
  async hasResults(): Promise<boolean> {
    return await this.isVisible(this.resultsTable);
  }

  /**
   * Check if "no results" message is displayed
   * @returns true if no results message is visible
   */
  async hasNoResults(): Promise<boolean> {
    return await this.isVisible(this.noResultsMessage);
  }

  /**
   * Click on a specific repair order row by order number
   * Opens the details panel
   *
   * @param orderNumber - Order number to click (e.g., "RO-2024-001")
   */
  async clickRepairOrder(orderNumber: string): Promise<void> {
    const row = this.page.locator(`tr:has-text("${orderNumber}")`);
    await this.click(row);
    await this.waitForElement(this.detailsPanel);
  }

  /**
   * Get all order numbers from the current page
   * Useful for verification and data validation
   *
   * @returns Array of order numbers
   */
  async getAllOrderNumbers(): Promise<string[]> {
    const rows = await this.tableRows.all();
    const orderNumbers: string[] = [];

    for (const row of rows) {
      const orderNumber = await row.locator('td:first-child').textContent();
      if (orderNumber) {
        orderNumbers.push(orderNumber.trim());
      }
    }

    return orderNumbers;
  }

  /**
   * Verify if a specific order number exists in the table
   * @param orderNumber - Order number to check
   * @returns true if order is found in table
   */
  async hasOrderNumber(orderNumber: string): Promise<boolean> {
    const orderNumbers = await this.getAllOrderNumbers();
    return orderNumbers.includes(orderNumber);
  }

  // ====================
  // Pagination Methods
  // ====================

  /**
   * Navigate to next page of results
   */
  async goToNextPage(): Promise<void> {
    await this.click(this.nextPageButton);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to previous page of results
   */
  async goToPreviousPage(): Promise<void> {
    await this.click(this.previousPageButton);
    await this.waitForPageLoad();
  }

  /**
   * Get pagination info text
   * @returns Pagination text (e.g., "Showing 1-10 of 50 results")
   */
  async getPaginationInfo(): Promise<string> {
    return await this.getText(this.pageInfo);
  }

  /**
   * Check if "Next" button is enabled
   * @returns true if next page is available
   */
  async hasNextPage(): Promise<boolean> {
    return await this.nextPageButton.isEnabled();
  }

  // ====================
  // Create/Edit Form Methods
  // ====================

  /**
   * Click "Create New Repair Order" button
   * Opens the creation form
   */
  async clickCreateNew(): Promise<void> {
    await this.click(this.createNewButton);
    await this.wait(500); // Wait for form modal/panel to appear
  }

  /**
   * Fill out the repair order form
   * Used for both creating and editing repair orders
   *
   * @param orderData - Object containing form field values
   */
  async fillRepairOrderForm(orderData: {
    customerName?: string;
    vehicleVin?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    description?: string;
    estimatedCost?: string;
    status?: string;
  }): Promise<void> {
    if (orderData.customerName) {
      await this.fill(this.customerNameInput, orderData.customerName);
    }
    if (orderData.vehicleVin) {
      await this.fill(this.vehicleVinInput, orderData.vehicleVin);
    }
    if (orderData.vehicleMake) {
      await this.fill(this.vehicleMakeInput, orderData.vehicleMake);
    }
    if (orderData.vehicleModel) {
      await this.fill(this.vehicleModelInput, orderData.vehicleModel);
    }
    if (orderData.vehicleYear) {
      await this.fill(this.vehicleYearInput, orderData.vehicleYear);
    }
    if (orderData.description) {
      await this.fill(this.descriptionInput, orderData.description);
    }
    if (orderData.estimatedCost) {
      await this.fill(this.estimatedCostInput, orderData.estimatedCost);
    }
    if (orderData.status) {
      await this.selectDropdown(this.statusDropdown, orderData.status);
    }
  }

  /**
   * Save the repair order form
   * Submits create or edit form
   */
  async saveForm(): Promise<void> {
    await this.click(this.saveButton);
    await this.waitForPageLoad();
  }

  /**
   * Cancel the repair order form
   * Closes form without saving
   */
  async cancelForm(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Create a new repair order (complete workflow)
   * Combines: click create → fill form → save
   *
   * @param orderData - Repair order details
   */
  async createRepairOrder(orderData: {
    customerName: string;
    vehicleVin: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    description: string;
    estimatedCost: string;
  }): Promise<void> {
    await this.clickCreateNew();
    await this.fillRepairOrderForm(orderData);
    await this.saveForm();
  }

  /**
   * Get form error message
   * @returns Error message text
   */
  async getFormError(): Promise<string> {
    return await this.getText(this.formErrorMessage);
  }

  /**
   * Check if form has validation errors
   * @returns true if error message is visible
   */
  async hasFormError(): Promise<boolean> {
    return await this.isVisible(this.formErrorMessage);
  }

  // ====================
  // Details Panel Methods
  // ====================

  /**
   * Check if details panel is open
   * @returns true if panel is visible
   */
  async isDetailsPanelOpen(): Promise<boolean> {
    return await this.isVisible(this.detailsPanel);
  }

  /**
   * Get order number from details panel
   * @returns Order number string
   */
  async getDetailsOrderNumber(): Promise<string> {
    return await this.getText(this.detailsOrderNumber);
  }

  /**
   * Get customer name from details panel
   * @returns Customer name string
   */
  async getDetailsCustomerName(): Promise<string> {
    return await this.getText(this.detailsCustomerName);
  }

  /**
   * Get status from details panel
   * @returns Status string
   */
  async getDetailsStatus(): Promise<string> {
    return await this.getText(this.detailsStatus);
  }

  /**
   * Close the details panel
   */
  async closeDetailsPanel(): Promise<void> {
    await this.click(this.closeDetailsButton);
    await this.waitForElementToDisappear(this.detailsPanel);
  }
}
