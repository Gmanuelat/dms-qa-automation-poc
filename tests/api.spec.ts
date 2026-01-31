/**
 * API Test Suite
 *
 * Tests DMS API endpoints using Playwright's APIRequestContext.
 *
 * Why API testing matters:
 * - Faster than UI tests (no browser rendering)
 * - Tests backend logic directly
 * - Validates data contracts
 * - Supports microservices testing
 * - Enables integration testing
 *
 * Tests covered:
 * - Authentication
 * - CRUD operations (Create, Read, Update, Delete)
 * - Response validation
 * - Error handling
 * - Performance testing (response times)
 */

import { test, expect } from "@playwright/test";
import {
  DmsApiClient,
  assertStatus,
  assertResponseContains,
  assertResponseTime,
} from "../utils/apiClient";
import { apiTestData, users, generateOrderNumber } from "../utils/testData";

/**
 * Test Suite: DMS API - Authentication
 */
test.describe("API - Authentication", () => {
  let apiClient: DmsApiClient;

  /**
   * Initialize API client before all tests
   */
  test.beforeAll(async () => {
    apiClient = new DmsApiClient();
    await apiClient.init();
  });

  /**
   * Clean up API client after all tests
   */
  test.afterAll(async () => {
    await apiClient.dispose();
  });

  /**
   * Test: Authenticate with valid credentials
   *
   * API Requirement:
   * POST /auth/login should return authentication token
   */
  test("should authenticate user with valid credentials", async () => {
    // Act - Authenticate via API
    const response = await apiClient.authenticate(
      users.validUser.username,
      users.validUser.password
    );

    // Assert - Response status should be 200 OK
    assertStatus(response, 200);

    // Assert - Response should contain token
    const body = await response.json();
    expect(body).toHaveProperty("token");
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe("string");
  });

  /**
   * Test: Reject invalid credentials
   *
   * Security Requirement:
   * Invalid credentials should return 401 Unauthorized
   */
  test("should reject authentication with invalid credentials", async () => {
    // Act - Attempt authentication with invalid credentials
    const response = await apiClient.authenticate(
      users.invalidUser.username,
      users.invalidUser.password
    );

    // Assert - Response status should be 401 Unauthorized
    assertStatus(response, 401);
  });

  /**
   * Test: Validate authentication token
   *
   * Security Requirement:
   * Valid tokens should be accepted, invalid tokens rejected
   */
  test("should validate authentication token", async () => {
    // Act - Validate token
    const response = await apiClient.validateToken();

    // Assert - Response should indicate token validity
    // Status 200 = valid, 401 = invalid
    expect([200, 401]).toContain(response.status());
  });
});

/**
 * Test Suite: DMS API - Repair Orders CRUD
 */
test.describe("API - Repair Orders", () => {
  let apiClient: DmsApiClient;
  let createdOrderId: string; // Store for cleanup

  /**
   * Initialize API client before all tests
   */
  test.beforeAll(async () => {
    apiClient = new DmsApiClient();
    await apiClient.init();
  });

  /**
   * Clean up API client after all tests
   */
  test.afterAll(async () => {
    await apiClient.dispose();
  });

  // ====================
  // READ Operations
  // ====================

  /**
   * Test: Get all repair orders
   *
   * API Requirement:
   * GET /repair-orders should return array of orders
   */
  test("should get all repair orders", async () => {
    // Arrange - Track response time
    const startTime = Date.now();

    // Act - Fetch all repair orders
    const response = await apiClient.getRepairOrders();

    // Assert - Response status should be 200 OK
    assertStatus(response, 200);

    // Assert - Response should be an array
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);

    // Assert - Response time should be reasonable
    assertResponseTime(startTime, 3000); // Max 3 seconds
  });

  /**
   * Test: Get specific repair order by ID
   *
   * API Requirement:
   * GET /repair-orders/{id} should return single order
   */
  test("should get repair order by ID", async () => {
    // Arrange - Use existing order ID from test data
    const orderId = "RO-2024-001";

    // Act - Fetch specific order
    const response = await apiClient.getRepairOrderById(orderId);

    // Assert - Response status should be 200 OK (or 404 if doesn't exist)
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      // Assert - Response should contain order details
      const body = await response.json();
      expect(body).toHaveProperty("orderNumber");
      expect(body.orderNumber).toBe(orderId);
    }
  });

  /**
   * Test: Handle non-existent order ID
   *
   * Error Handling Requirement:
   * Invalid IDs should return 404 Not Found
   */
  test("should return 404 for non-existent repair order", async () => {
    // Act - Request non-existent order
    const response = await apiClient.getRepairOrderById("RO-9999-999");

    // Assert - Should return 404 Not Found
    assertStatus(response, 404);
  });

  // ====================
  // CREATE Operations
  // ====================

  /**
   * Test: Create new repair order
   *
   * API Requirement:
   * POST /repair-orders should create order and return created object
   */
  test("should create new repair order", async () => {
    // Arrange - Prepare order data
    const orderData = {
      ...apiTestData.createRepairOrderPayload,
      orderNumber: generateOrderNumber(), // Unique order number
    };

    // Act - Create repair order
    const response = await apiClient.createRepairOrder(orderData);

    // Assert - Response status should be 201 Created
    assertStatus(response, 201);

    // Assert - Response should contain created order
    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.customerName).toBe(orderData.customerName);
    expect(body.vehicleVin).toBe(orderData.vehicleVin);

    // Store order ID for potential cleanup or further testing
    createdOrderId = body.id;
  });

  /**
   * Test: Create order with missing required fields
   *
   * Validation Requirement:
   * Missing required fields should return 400 Bad Request
   */
  test("should reject repair order with missing required fields", async () => {
    // Arrange - Incomplete data (missing required fields)
    const incompleteData = {
      customerName: "Incomplete Test",
      // Missing: vehicleVin, serviceType, etc.
    };

    // Act - Attempt to create order
    const response = await apiClient.createRepairOrder(incompleteData);

    // Assert - Should return 400 Bad Request
    assertStatus(response, 400);

    // Assert - Error message should indicate validation failure
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  // ====================
  // UPDATE Operations
  // ====================

  /**
   * Test: Update existing repair order
   *
   * API Requirement:
   * PATCH /repair-orders/{id} should update order
   */
  test("should update repair order status", async () => {
    // Arrange - Use existing order or create one first
    const orderId = createdOrderId || "RO-2024-001";
    const updateData = {
      ...apiTestData.updateRepairOrderPayload,
    };

    // Act - Update repair order
    const response = await apiClient.updateRepairOrder(orderId, updateData);

    // Assert - Response status should be 200 OK (or 404 if doesn't exist)
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      // Assert - Response should contain updated data
      const body = await response.json();
      assertResponseContains(body, { status: updateData.status });
    }
  });

  /**
   * Test: Partial update (only some fields)
   *
   * API Requirement:
   * PATCH should support partial updates
   */
  test("should perform partial update on repair order", async () => {
    // Arrange - Update only status field
    const orderId = createdOrderId || "RO-2024-001";
    const partialUpdate = {
      status: "In Progress",
    };

    // Act - Partial update
    const response = await apiClient.updateRepairOrder(orderId, partialUpdate);

    // Assert - Should succeed (200 or 404 if test order doesn't exist)
    expect([200, 404]).toContain(response.status());
  });

  // ====================
  // DELETE Operations
  // ====================

  /**
   * Test: Delete repair order
   *
   * API Requirement:
   * DELETE /repair-orders/{id} should remove order
   *
   * Note: Commented out by default to prevent accidental data deletion
   * Uncomment if your test environment supports deletion
   */
  test.skip("should delete repair order", async () => {
    // Arrange - Create order specifically for deletion
    const orderData = {
      ...apiTestData.createRepairOrderPayload,
      orderNumber: generateOrderNumber(),
    };
    const createResponse = await apiClient.createRepairOrder(orderData);
    const createdOrder = await createResponse.json();
    const orderIdToDelete = createdOrder.id;

    // Act - Delete the order
    const deleteResponse = await apiClient.deleteRepairOrder(orderIdToDelete);

    // Assert - Should return 204 No Content or 200 OK
    expect([200, 204]).toContain(deleteResponse.status());

    // Assert - Verify order is gone (GET should return 404)
    const getResponse = await apiClient.getRepairOrderById(orderIdToDelete);
    assertStatus(getResponse, 404);
  });

  // ====================
  // Search/Filter Operations
  // ====================

  /**
   * Test: Search repair orders by status
   *
   * API Requirement:
   * GET /repair-orders?status={status} should filter results
   */
  test("should search repair orders by status", async () => {
    // Act - Search by status
    const response = await apiClient.searchRepairOrders({ status: "Completed" });

    // Assert - Response status should be 200 OK
    assertStatus(response, 200);

    // Assert - Results should be an array
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);

    // Assert - All results should have "Completed" status
    // (if API properly filters)
    if (body.length > 0) {
      body.forEach((order: { status: string }) => {
        expect(order.status).toBe("Completed");
      });
    }
  });

  /**
   * Test: Search with multiple filters
   *
   * API Requirement:
   * Should support multiple query parameters
   */
  test("should search repair orders with multiple filters", async () => {
    // Act - Search with status and customer name
    const response = await apiClient.searchRepairOrders({
      status: "In Progress",
      customerName: "Smith",
    });

    // Assert - Response should be filtered results
    assertStatus(response, 200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

/**
 * Test Suite: DMS API - Appointments
 */
test.describe("API - Appointments", () => {
  let apiClient: DmsApiClient;

  test.beforeAll(async () => {
    apiClient = new DmsApiClient();
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  /**
   * Test: Get all appointments
   *
   * API Requirement:
   * GET /appointments should return array of appointments
   */
  test("should get all appointments", async () => {
    // Act - Fetch all appointments
    const response = await apiClient.getAppointments();

    // Assert - Response status should be 200 OK
    assertStatus(response, 200);

    // Assert - Response should be an array
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  /**
   * Test: Get specific appointment by ID
   *
   * API Requirement:
   * GET /appointments/{id} should return single appointment
   */
  test("should get appointment by ID", async () => {
    // Arrange - Use existing appointment ID
    const appointmentId = "APT-2024-001";

    // Act - Fetch specific appointment
    const response = await apiClient.getAppointmentById(appointmentId);

    // Assert - Response should be 200 OK or 404 Not Found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty("appointmentId");
    }
  });

  /**
   * Test: Create new appointment
   *
   * API Requirement:
   * POST /appointments should create appointment
   */
  test("should create new appointment", async () => {
    // Arrange - Prepare appointment data
    const appointmentData = {
      customerName: "API Test Customer",
      phoneNumber: "(555) 987-6543",
      email: "apitest@example.com",
      serviceType: "Oil Change",
      vehicleVin: "1HGCM82633A987654",
      scheduledDate: "2024-07-01",
      scheduledTime: "10:00 AM",
    };

    // Act - Create appointment
    const response = await apiClient.createAppointment(appointmentData);

    // Assert - Should return 201 Created
    assertStatus(response, 201);

    // Assert - Response should contain created appointment
    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.customerName).toBe(appointmentData.customerName);
  });

  /**
   * Test: Update appointment
   *
   * API Requirement:
   * PATCH /appointments/{id} should update appointment
   */
  test("should update appointment", async () => {
    // Arrange - Update data
    const appointmentId = "APT-2024-001";
    const updateData = {
      scheduledDate: "2024-07-15",
      scheduledTime: "2:00 PM",
    };

    // Act - Update appointment
    const response = await apiClient.updateAppointment(
      appointmentId,
      updateData
    );

    // Assert - Should succeed (200 or 404)
    expect([200, 404]).toContain(response.status());
  });

  /**
   * Test: Cancel appointment
   *
   * API Requirement:
   * DELETE /appointments/{id} should cancel appointment
   */
  test.skip("should cancel appointment", async () => {
    // Note: Skipped by default to prevent accidental cancellations
    const appointmentId = "APT-2024-001";

    // Act - Cancel appointment
    const response = await apiClient.cancelAppointment(appointmentId);

    // Assert - Should return success
    expect([200, 204]).toContain(response.status());
  });
});

/**
 * Test Suite: API Performance & Contract Testing
 */
test.describe("API - Performance & Contract", () => {
  let apiClient: DmsApiClient;

  test.beforeAll(async () => {
    apiClient = new DmsApiClient();
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  /**
   * Test: API response time
   *
   * Performance Requirement:
   * API should respond within acceptable time limits
   */
  test("should respond within acceptable time for GET requests", async () => {
    const startTime = Date.now();

    // Act - Make API request
    await apiClient.getRepairOrders();

    // Assert - Response time should be under 2 seconds
    assertResponseTime(startTime, 2000);
  });

  /**
   * Test: API contract validation
   *
   * Contract Testing:
   * API responses should match expected schema
   */
  test("should return repair orders with correct schema", async () => {
    // Act - Fetch repair orders
    const response = await apiClient.getRepairOrders();
    const body = await response.json();

    // Assert - Each order should have required fields
    if (body.length > 0) {
      const firstOrder = body[0];

      // Verify schema structure
      expect(firstOrder).toHaveProperty("id");
      expect(firstOrder).toHaveProperty("orderNumber");
      expect(firstOrder).toHaveProperty("customerName");
      expect(firstOrder).toHaveProperty("status");
      expect(firstOrder).toHaveProperty("vehicleVin");

      // Verify data types
      expect(typeof firstOrder.id).toBe("string");
      expect(typeof firstOrder.orderNumber).toBe("string");
      expect(typeof firstOrder.customerName).toBe("string");
    }
  });

  /**
   * Test: Error response format
   *
   * Error Handling Requirement:
   * Errors should follow consistent format
   */
  test("should return consistent error format for 404", async () => {
    // Act - Request non-existent resource
    const response = await apiClient.getRepairOrderById("INVALID-ID");

    // Assert - Should be 404
    assertStatus(response, 404);

    // Assert - Error response should have standard format
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(typeof body.error).toBe("string");
  });
});

/**
 * API Testing Best Practices Demonstrated:
 *
 * 1. Test Organization
 *    - Grouped by resource (Auth, Repair Orders, Appointments)
 *    - CRUD operations tested systematically
 *    - Performance and contract tests separated
 *
 * 2. Response Validation
 *    - Status codes checked
 *    - Response body structure validated
 *    - Data types verified
 *
 * 3. Error Handling
 *    - Invalid inputs tested (400)
 *    - Non-existent resources tested (404)
 *    - Unauthorized access tested (401)
 *
 * 4. Performance Testing
 *    - Response times measured
 *    - Timeout assertions
 *
 * 5. Contract Testing
 *    - Schema validation
 *    - Required fields verified
 *    - Data types checked
 *
 * 6. Test Data Management
 *    - Uses testData.ts for consistency
 *    - Generates unique IDs to prevent conflicts
 *    - Cleanup considerations (afterAll hooks)
 *
 * Why This Matters to Recruiters:
 * - Shows full-stack testing capability
 * - Demonstrates API understanding
 * - Proves you can test beyond UI
 * - Modern approach (API-first testing)
 */
