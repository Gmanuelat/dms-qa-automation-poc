/**
 * API Client Module
 *
 * Provides reusable API helper functions using Playwright's APIRequestContext.
 *
 * Why use Playwright for API testing?
 * 1. Single tool for UI + API testing (no need for axios, supertest, etc.)
 * 2. Built-in authentication, retries, and timeouts
 * 3. Seamless integration with UI tests (can verify UI changes via API)
 * 4. Automatic request/response logging in Playwright reports
 */

import { APIRequestContext, request } from "@playwright/test";
import { apiTestData } from "./testData";

// ====================
// API Client Class
// ====================

/**
 * DMS API Client
 *
 * Handles all API interactions for the DMS application.
 * Uses Playwright's APIRequestContext for making HTTP requests.
 */
export class DmsApiClient {
  private apiContext: APIRequestContext | null = null;
  private baseURL: string;
  private authToken: string;

  constructor() {
    this.baseURL = apiTestData.auth.baseUrl;
    this.authToken = apiTestData.auth.token;
  }

  /**
   * Initialize the API request context
   * Must be called before making any API requests
   *
   * Why separate initialization?
   * - Allows async setup (Playwright's request.newContext() is async)
   * - Enables reuse across multiple tests
   * - Proper cleanup with dispose()
   */
  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      // Ignore HTTPS errors for test environments (never use in production!)
      ignoreHTTPSErrors: true,
    });
  }

  /**
   * Clean up the API context
   * Should be called in afterAll() hook to prevent memory leaks
   */
  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  /**
   * Get the initialized API context
   * Throws error if init() hasn't been called
   */
  private getContext(): APIRequestContext {
    if (!this.apiContext) {
      throw new Error(
        "API context not initialized. Call init() before making requests."
      );
    }
    return this.apiContext;
  }

  // ====================
  // Repair Orders API
  // ====================

  /**
   * Get all repair orders
   *
   * @returns Response with array of repair orders
   */
  async getRepairOrders() {
    const context = this.getContext();
    return await context.get("/repair-orders");
  }

  /**
   * Get a specific repair order by ID
   *
   * @param orderId - Repair order ID (e.g., "RO-2024-001")
   * @returns Response with repair order details
   */
  async getRepairOrderById(orderId: string) {
    const context = this.getContext();
    return await context.get(`/repair-orders/${orderId}`);
  }

  /**
   * Create a new repair order
   *
   * @param orderData - Repair order payload
   * @returns Response with created repair order
   *
   * Example payload:
   * {
   *   customerName: "John Doe",
   *   vehicleVin: "1HGCM82633A123456",
   *   serviceType: "Oil Change"
   * }
   */
  async createRepairOrder(orderData: Record<string, unknown>) {
    const context = this.getContext();
    return await context.post("/repair-orders", {
      data: orderData,
    });
  }

  /**
   * Update an existing repair order
   *
   * @param orderId - Repair order ID to update
   * @param updateData - Fields to update
   * @returns Response with updated repair order
   */
  async updateRepairOrder(orderId: string, updateData: Record<string, unknown>) {
    const context = this.getContext();
    return await context.patch(`/repair-orders/${orderId}`, {
      data: updateData,
    });
  }

  /**
   * Delete a repair order
   *
   * @param orderId - Repair order ID to delete
   * @returns Response confirming deletion
   */
  async deleteRepairOrder(orderId: string) {
    const context = this.getContext();
    return await context.delete(`/repair-orders/${orderId}`);
  }

  /**
   * Search repair orders with filters
   *
   * @param filters - Query parameters (status, customerName, dateRange, etc.)
   * @returns Response with filtered repair orders
   *
   * Example:
   * searchRepairOrders({ status: "Completed", customerName: "Smith" })
   */
  async searchRepairOrders(filters: Record<string, string>) {
    const context = this.getContext();
    // Convert filters object to URL query parameters
    const queryParams = new URLSearchParams(filters).toString();
    return await context.get(`/repair-orders?${queryParams}`);
  }

  // ====================
  // Appointments API
  // ====================

  /**
   * Get all appointments
   *
   * @returns Response with array of appointments
   */
  async getAppointments() {
    const context = this.getContext();
    return await context.get("/appointments");
  }

  /**
   * Get a specific appointment by ID
   *
   * @param appointmentId - Appointment ID
   * @returns Response with appointment details
   */
  async getAppointmentById(appointmentId: string) {
    const context = this.getContext();
    return await context.get(`/appointments/${appointmentId}`);
  }

  /**
   * Create a new appointment
   *
   * @param appointmentData - Appointment payload
   * @returns Response with created appointment
   */
  async createAppointment(appointmentData: Record<string, unknown>) {
    const context = this.getContext();
    return await context.post("/appointments", {
      data: appointmentData,
    });
  }

  /**
   * Update an existing appointment
   *
   * @param appointmentId - Appointment ID to update
   * @param updateData - Fields to update
   * @returns Response with updated appointment
   */
  async updateAppointment(
    appointmentId: string,
    updateData: Record<string, unknown>
  ) {
    const context = this.getContext();
    return await context.patch(`/appointments/${appointmentId}`, {
      data: updateData,
    });
  }

  /**
   * Cancel an appointment
   *
   * @param appointmentId - Appointment ID to cancel
   * @returns Response confirming cancellation
   */
  async cancelAppointment(appointmentId: string) {
    const context = this.getContext();
    return await context.delete(`/appointments/${appointmentId}`);
  }

  // ====================
  // Authentication API (if separate from main auth)
  // ====================

  /**
   * Authenticate user and get access token
   * Useful for testing login workflows via API
   *
   * @param username - User email
   * @param password - User password
   * @returns Response with authentication token
   */
  async authenticate(username: string, password: string) {
    const context = this.getContext();
    return await context.post("/auth/login", {
      data: { username, password },
    });
  }

  /**
   * Validate current authentication token
   *
   * @returns Response indicating token validity
   */
  async validateToken() {
    const context = this.getContext();
    return await context.get("/auth/validate");
  }

  // ====================
  // Helper Methods
  // ====================

  /**
   * Generic GET request
   * Use for custom endpoints not covered by specific methods
   *
   * @param endpoint - API endpoint path
   * @returns API response
   */
  async get(endpoint: string) {
    const context = this.getContext();
    return await context.get(endpoint);
  }

  /**
   * Generic POST request
   *
   * @param endpoint - API endpoint path
   * @param data - Request payload
   * @returns API response
   */
  async post(endpoint: string, data: Record<string, unknown>) {
    const context = this.getContext();
    return await context.post(endpoint, { data });
  }

  /**
   * Generic PATCH request
   *
   * @param endpoint - API endpoint path
   * @param data - Request payload
   * @returns API response
   */
  async patch(endpoint: string, data: Record<string, unknown>) {
    const context = this.getContext();
    return await context.patch(endpoint, { data });
  }

  /**
   * Generic DELETE request
   *
   * @param endpoint - API endpoint path
   * @returns API response
   */
  async delete(endpoint: string) {
    const context = this.getContext();
    return await context.delete(endpoint);
  }
}

// ====================
// Response Validation Helpers
// ====================

/**
 * Validate API response status code
 *
 * @param response - Playwright API response
 * @param expectedStatus - Expected HTTP status code
 * @throws Error if status doesn't match
 *
 * Usage:
 * const response = await apiClient.getRepairOrders();
 * assertStatus(response, 200);
 */
export function assertStatus(
  response: { status: () => number },
  expectedStatus: number
): void {
  const actualStatus = response.status();
  if (actualStatus !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, but got ${actualStatus}`
    );
  }
}

/**
 * Validate response body contains expected data
 *
 * @param response - Playwright API response
 * @param expectedData - Object with expected key-value pairs
 * @throws Error if data doesn't match
 *
 * Usage:
 * const response = await apiClient.getRepairOrderById("RO-001");
 * const body = await response.json();
 * assertResponseContains(body, { status: "Completed" });
 */
export function assertResponseContains(
  responseBody: Record<string, unknown>,
  expectedData: Record<string, unknown>
): void {
  for (const [key, expectedValue] of Object.entries(expectedData)) {
    const actualValue = responseBody[key];
    if (actualValue !== expectedValue) {
      throw new Error(
        `Expected ${key} to be "${expectedValue}", but got "${actualValue}"`
      );
    }
  }
}

/**
 * Validate response time is within acceptable threshold
 *
 * @param startTime - Request start time (Date.now())
 * @param maxDuration - Maximum acceptable duration in milliseconds
 * @throws Error if response took too long
 *
 * Usage:
 * const start = Date.now();
 * await apiClient.getRepairOrders();
 * assertResponseTime(start, 2000); // Max 2 seconds
 */
export function assertResponseTime(startTime: number, maxDuration: number): void {
  const duration = Date.now() - startTime;
  if (duration > maxDuration) {
    throw new Error(
      `Response took ${duration}ms, expected under ${maxDuration}ms`
    );
  }
}
