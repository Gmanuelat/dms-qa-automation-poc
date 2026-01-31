/**
 * Test Data Module
 *
 * Centralizes all test data used across UI and API tests.
 *
 * Why centralize test data?
 * 1. Single source of truth - update once, changes everywhere
 * 2. Prevents magic strings scattered throughout tests
 * 3. Makes tests more readable (testData.validUser vs "test@example.com")
 * 4. Easy to add new test scenarios
 */

// ====================
// User Credentials
// ====================

/**
 * Test user accounts
 * Credentials are loaded from environment variables (.env file)
 */
export const users = {
  // Valid user for successful login tests
  validUser: {
    username: process.env.DMS_USER || "test.user@example.com",
    password: process.env.DMS_PASS || "password123",
  },

  // Invalid credentials for negative testing
  invalidUser: {
    username: "invalid.user@example.com",
    password: "wrongpassword",
  },

  // User with empty fields for validation testing
  emptyUser: {
    username: "",
    password: "",
  },
};

// ====================
// Repair Order Test Data
// ====================

/**
 * Test data for repair order search and validation
 */
export const repairOrders = {
  // Existing repair order for search tests (placeholder)
  existingOrder: {
    orderNumber: "RO-2024-001",
    customerName: "John Smith",
    vehicleVin: "1HGBH41JXMN109186",
    status: "In Progress",
  },

  // New repair order for creation tests
  newOrder: {
    customerName: "Jane Doe",
    vehicleVin: "1FADP3K29JL234567",
    vehicleMake: "Ford",
    vehicleModel: "Fusion",
    vehicleYear: "2024",
    description: "Oil change and tire rotation",
    estimatedCost: "150.00",
  },

  // Search filters
  searchFilters: {
    validOrderNumber: "RO-2024-001",
    invalidOrderNumber: "RO-9999-999",
    customerName: "Smith",
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
  },

  // Status values used in the DMS
  statuses: [
    "Pending",
    "In Progress",
    "Awaiting Parts",
    "Completed",
    "Cancelled",
  ],
};

// ====================
// Appointment Test Data
// ====================

/**
 * Test data for appointment scheduling
 */
export const appointments = {
  // New appointment for creation tests
  newAppointment: {
    customerName: "Alice Johnson",
    phoneNumber: "(555) 123-4567",
    email: "alice.johnson@example.com",
    serviceType: "Maintenance",
    vehicleVin: "1G1ZD5ST8JF123456",
    preferredDate: getNextBusinessDay(), // Helper function for dynamic dates
    preferredTime: "10:00 AM",
    notes: "Customer prefers morning appointments",
  },

  // Existing appointment for update/cancel tests
  existingAppointment: {
    appointmentId: "APT-2024-001",
    customerName: "Bob Williams",
    scheduledDate: "2024-06-15",
    scheduledTime: "2:00 PM",
  },

  // Service types offered by the DMS
  serviceTypes: [
    "Oil Change",
    "Tire Rotation",
    "Brake Service",
    "Maintenance",
    "Diagnostics",
    "Repair",
  ],
};

// ====================
// API Test Data
// ====================

/**
 * Test data specific to API testing
 */
export const apiTestData = {
  // API authentication
  auth: {
    baseUrl: process.env.API_BASE_URL || "https://api.example-dms.com/v1",
    token: process.env.API_TOKEN || "default-test-token",
  },

  // Sample API payloads
  createRepairOrderPayload: {
    customerName: "API Test Customer",
    vehicleVin: "1HGCM82633A123456",
    serviceType: "Oil Change",
    priority: "Normal",
    notes: "Created via API automation test",
  },

  updateRepairOrderPayload: {
    status: "Completed",
    completionNotes: "Service completed successfully",
    actualCost: "125.00",
  },
};

// ====================
// Helper Functions
// ====================

/**
 * Get the next business day (Monday-Friday) for appointment scheduling
 * Skips weekends to simulate realistic appointment booking
 *
 * @returns Date string in YYYY-MM-DD format
 */
function getNextBusinessDay(): string {
  const today = new Date();
  let daysToAdd = 1;

  // If today is Friday (5) or Saturday (6), schedule for next Monday
  if (today.getDay() === 5) daysToAdd = 3; // Friday → Monday
  if (today.getDay() === 6) daysToAdd = 2; // Saturday → Monday

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + daysToAdd);

  return nextDay.toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

/**
 * Generate a random VIN (Vehicle Identification Number)
 * Useful for creating unique test data
 *
 * @returns 17-character VIN string
 */
export function generateRandomVIN(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"; // Excludes I, O, Q
  let vin = "";
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
}

/**
 * Generate a unique order number for test isolation
 * Format: RO-YYYY-XXXXX (RO = Repair Order)
 *
 * @returns Unique order number string
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `RO-${year}-${random}`;
}

// ====================
// Validation Data
// ====================

/**
 * Expected error messages for validation testing
 */
export const errorMessages = {
  login: {
    invalidCredentials: "Invalid username or password",
    emptyUsername: "Username is required",
    emptyPassword: "Password is required",
  },

  repairOrder: {
    orderNotFound: "Repair order not found",
    invalidVin: "Invalid VIN format",
    requiredField: "This field is required",
  },

  appointment: {
    pastDate: "Cannot schedule appointments in the past",
    invalidPhone: "Invalid phone number format",
    invalidEmail: "Invalid email format",
  },
};

// ====================
// Timeout Values
// ====================

/**
 * Common timeout values used across tests
 * Centralized for easy adjustment based on environment performance
 */
export const timeouts = {
  short: 5000, // 5 seconds - for fast operations (button clicks, input)
  medium: 10000, // 10 seconds - for page loads, form submissions
  long: 30000, // 30 seconds - for API calls, reports generation
};
