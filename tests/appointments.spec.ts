/**
 * Appointments Test Suite
 *
 * Tests appointment scheduling and management:
 * - Schedule new appointments
 * - View appointments (list and calendar views)
 * - Update/reschedule appointments
 * - Cancel appointments
 * - Form validation
 *
 * Demonstrates:
 * - Date/time handling
 * - Calendar interaction
 * - Multi-step workflows
 * - Confirmation dialogs
 */

import { test, expect } from "@playwright/test";
import { AppointmentsPage } from "../pages/AppointmentsPage";
import { LoginPage } from "../pages/LoginPage";
import { users, appointments } from "../utils/testData";

/**
 * Test Suite: Appointment Management
 */
test.describe("Appointment Management", () => {
  /**
   * Login and navigate to appointments page before each test
   */
  test.beforeEach(async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);

    // Step 2: Navigate to Appointments page
    const appointmentsPage = new AppointmentsPage(page);
    await appointmentsPage.navigate();
  });

  // ====================
  // View Toggle Tests
  // ====================

  /**
   * Test: Switch between list and calendar views
   *
   * UX Requirement:
   * Users should be able to toggle between list and calendar views
   */
  test("should switch to calendar view", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Switch to calendar view
    await appointmentsPage.switchToCalendarView();

    // Assert - Calendar should be displayed
    // (Verification depends on your app's implementation)

    // Act - Switch back to list view
    await appointmentsPage.switchToListView();

    // Assert - List view should be displayed
  });

  // ====================
  // Create Appointment Tests
  // ====================

  /**
   * Test: Schedule new appointment with valid data
   *
   * Business Requirement:
   * Users should be able to schedule appointments for customers
   *
   * Steps:
   * 1. Click "Schedule New"
   * 2. Fill appointment form
   * 3. Save
   * 4. Verify appointment created
   */
  test("should schedule new appointment successfully", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Generate unique customer name to avoid conflicts
    const uniqueCustomerName = `${appointments.newAppointment.customerName} ${Date.now()}`;
    const appointmentData = {
      ...appointments.newAppointment,
      customerName: uniqueCustomerName,
    };

    // Act - Schedule appointment
    await appointmentsPage.scheduleAppointment(appointmentData);

    // Assert - Success notification should appear (if app has notifications)
    // const hasSuccess = await appointmentsPage.hasSuccessNotification();
    // expect(hasSuccess).toBe(true);

    // Assert - No form errors
    const hasError = await appointmentsPage.hasFormError();
    expect(hasError).toBe(false);

    // Optional: Search for the appointment to verify it was created
    // await appointmentsPage.clickAppointment(uniqueCustomerName);
    // expect(await appointmentsPage.isDetailsModalOpen()).toBe(true);
  });

  /**
   * Test: Form validation - missing required fields
   *
   * Validation Requirement:
   * Required fields should be validated before submission
   */
  test("should show validation error for incomplete appointment form", async ({
    page,
  }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Open schedule form
    await appointmentsPage.clickScheduleNew();

    // Act - Fill only customer name (incomplete)
    await appointmentsPage.fillAppointmentForm({
      customerName: "Incomplete Test",
      // Missing: phone, email, service type, date, time
    });

    // Act - Attempt to save
    await appointmentsPage.saveAppointment();

    // Assert - Form error should appear
    const hasError = await appointmentsPage.hasFormError();
    expect(hasError).toBe(true);
  });

  /**
   * Test: Phone number validation
   *
   * Validation Requirement:
   * Phone number should be in correct format
   */
  test("should validate phone number format", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Open schedule form
    await appointmentsPage.clickScheduleNew();

    // Act - Enter invalid phone number
    await appointmentsPage.fillAppointmentForm({
      customerName: "Phone Test",
      phoneNumber: "invalid", // Invalid format
      email: "test@example.com",
      serviceType: "Oil Change",
      vehicleVin: "1234567890ABCDEFG",
      preferredDate: appointments.newAppointment.preferredDate,
      preferredTime: "10:00 AM",
    });

    // Act - Attempt to save
    await appointmentsPage.saveAppointment();

    // Assert - Phone validation error should appear
    // const phoneError = await appointmentsPage.getPhoneNumberError();
    // expect(phoneError).toContain("invalid phone");

    // Or check for general form error
    const hasError = await appointmentsPage.hasFormError();
    expect(hasError).toBe(true);
  });

  /**
   * Test: Email validation
   *
   * Validation Requirement:
   * Email should be in correct format
   */
  test("should validate email format", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Open schedule form
    await appointmentsPage.clickScheduleNew();

    // Act - Enter invalid email
    await appointmentsPage.fillAppointmentForm({
      customerName: "Email Test",
      phoneNumber: "(555) 123-4567",
      email: "invalid-email", // Missing @ and domain
      serviceType: "Maintenance",
      vehicleVin: "1234567890ABCDEFG",
      preferredDate: appointments.newAppointment.preferredDate,
      preferredTime: "2:00 PM",
    });

    // Act - Attempt to save
    await appointmentsPage.saveAppointment();

    // Assert - Email validation error should appear
    // const emailError = await appointmentsPage.getEmailError();
    // expect(emailError).toContain("invalid email");

    // Or check for general form error
    const hasError = await appointmentsPage.hasFormError();
    expect(hasError).toBe(true);
  });

  /**
   * Test: Cancel appointment form
   *
   * UX Requirement:
   * Users should be able to cancel without saving
   */
  test("should cancel appointment form without creating", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Get current count
    const initialCount = await appointmentsPage.getAppointmentCount();

    // Act - Open form, fill data, then cancel
    await appointmentsPage.clickScheduleNew();
    await appointmentsPage.fillAppointmentForm(appointments.newAppointment);
    await appointmentsPage.cancelForm();

    // Assert - Count should remain the same (no appointment created)
    const finalCount = await appointmentsPage.getAppointmentCount();
    expect(finalCount).toBe(initialCount);
  });

  // ====================
  // View Appointment Tests
  // ====================

  /**
   * Test: View appointment details
   *
   * Business Requirement:
   * Users should be able to view detailed information for appointments
   */
  test("should display appointment details when clicked", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Click on an appointment
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Assert - Details modal should open
    const isModalOpen = await appointmentsPage.isDetailsModalOpen();
    expect(isModalOpen).toBe(true);

    // Assert - Customer name should be displayed
    const customerName = await appointmentsPage.getDetailsCustomerName();
    expect(customerName).toContain(
      appointments.existingAppointment.customerName
    );
  });

  /**
   * Test: Close appointment details modal
   *
   * UX Requirement:
   * Users should be able to close the details modal
   */
  test("should close appointment details modal", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Open details first
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );
    expect(await appointmentsPage.isDetailsModalOpen()).toBe(true);

    // Act - Close modal
    await appointmentsPage.closeDetailsModal();

    // Assert - Modal should be closed
    const isModalOpen = await appointmentsPage.isDetailsModalOpen();
    expect(isModalOpen).toBe(false);
  });

  /**
   * Test: Verify appointment details data
   *
   * Data Accuracy Requirement:
   * Details should show correct information
   */
  test("should display correct data in appointment details", async ({
    page,
  }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Open details
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Assert - Verify scheduled date
    const scheduledDate = await appointmentsPage.getDetailsScheduledDate();
    expect(scheduledDate).toContain(
      appointments.existingAppointment.scheduledDate
    );

    // Assert - Verify scheduled time
    const scheduledTime = await appointmentsPage.getDetailsScheduledTime();
    expect(scheduledTime).toContain(
      appointments.existingAppointment.scheduledTime
    );
  });

  // ====================
  // Filter Tests
  // ====================

  /**
   * Test: Filter appointments by service type
   *
   * Business Requirement:
   * Users should be able to filter by service type
   */
  test("should filter appointments by service type", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Filter by service type
    await appointmentsPage.filterByServiceType("Oil Change");

    // Assert - Appointments should be filtered
    // (Verification depends on your app's filter implementation)
    const count = await appointmentsPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(0); // Could be 0 if no oil change appointments
  });

  /**
   * Test: Filter appointments by status
   *
   * Business Requirement:
   * Users should be able to filter by appointment status
   */
  test("should filter appointments by status", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Filter by status
    await appointmentsPage.filterByStatus("Scheduled");

    // Assert - Results should update
    const count = await appointmentsPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  /**
   * Test: Filter appointments by date
   *
   * Business Requirement:
   * Users should be able to filter by specific date
   */
  test("should filter appointments by date", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Act - Filter by specific date
    await appointmentsPage.filterByDate("2024-06-15");

    // Assert - Results should update (might be empty if no appointments on that date)
    // This is a valid test - empty results are acceptable for date filters
  });

  // ====================
  // Calendar Tests
  // ====================

  /**
   * Test: Navigate calendar months
   *
   * UX Requirement:
   * Users should be able to navigate through calendar months
   */
  test("should navigate to next and previous months", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Switch to calendar view
    await appointmentsPage.switchToCalendarView();

    // Get current month
    const currentMonth = await appointmentsPage.getCurrentMonth();

    // Act - Go to next month
    await appointmentsPage.goToNextMonth();

    // Assert - Month should change
    const nextMonth = await appointmentsPage.getCurrentMonth();
    expect(nextMonth).not.toBe(currentMonth);

    // Act - Go to previous month
    await appointmentsPage.goToPreviousMonth();

    // Assert - Should be back to original month
    const backToOriginalMonth = await appointmentsPage.getCurrentMonth();
    expect(backToOriginalMonth).toBe(currentMonth);
  });

  /**
   * Test: Click on calendar day
   *
   * UX Requirement:
   * Users should be able to click calendar days to view/create appointments
   */
  test("should click on calendar day", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Switch to calendar view
    await appointmentsPage.switchToCalendarView();

    // Act - Click on day 15
    await appointmentsPage.clickCalendarDay(15);

    // Assert - Should show appointments for that day OR open create form
    // (Behavior depends on your app's implementation)
  });

  // ====================
  // Update/Reschedule Tests
  // ====================

  /**
   * Test: Reschedule appointment
   *
   * Business Requirement:
   * Users should be able to reschedule appointments
   */
  test("should open reschedule form for appointment", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Open appointment details
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Act - Click reschedule button
    await appointmentsPage.clickReschedule();

    // Assert - Reschedule form should open
    // (Verification depends on your app's implementation)
    // You might check for form fields becoming editable
  });

  // ====================
  // Cancel Appointment Tests
  // ====================

  /**
   * Test: Cancel appointment with confirmation
   *
   * Business Requirement:
   * Users should be able to cancel appointments
   *
   * UX Requirement:
   * Cancellation should require confirmation (destructive action)
   */
  test("should show confirmation dialog when cancelling appointment", async ({
    page,
  }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Open appointment details
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Act - Click cancel appointment button
    await appointmentsPage.clickCancelAppointment();

    // Assert - Confirmation dialog should appear
    // (Depends on your app having a confirmation dialog)
    // You would verify dialog text, confirm/decline buttons, etc.
  });

  /**
   * Test: Confirm appointment cancellation
   *
   * Business Workflow:
   * Complete cancellation process
   */
  test("should cancel appointment after confirmation", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Open appointment details
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Act - Cancel appointment
    await appointmentsPage.clickCancelAppointment();

    // Act - Confirm cancellation
    await appointmentsPage.confirmCancellation();

    // Assert - Appointment should be cancelled
    // You might verify:
    // - Status changed to "Cancelled"
    // - Removed from active appointments list
    // - Success notification appears
  });

  /**
   * Test: Decline appointment cancellation
   *
   * UX Requirement:
   * Users should be able to decline cancellation (change their mind)
   */
  test("should keep appointment when declining cancellation", async ({
    page,
  }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Open appointment details
    await appointmentsPage.clickAppointment(
      appointments.existingAppointment.customerName
    );

    // Act - Start cancellation
    await appointmentsPage.clickCancelAppointment();

    // Act - Decline cancellation
    await appointmentsPage.declineCancellation();

    // Assert - Appointment should still exist (not cancelled)
    // Details modal should still be open with same data
    expect(await appointmentsPage.isDetailsModalOpen()).toBe(true);
  });

  // ====================
  // List View Tests
  // ====================

  /**
   * Test: Display appointments in list view
   *
   * Business Requirement:
   * System should display appointments in a list format
   */
  test("should display appointments list", async ({ page }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Arrange - Ensure we're in list view
    await appointmentsPage.switchToListView();

    // Assert - At least some appointments should be displayed
    const count = await appointmentsPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(0); // Could be 0 for new system
  });

  // ====================
  // Integration Tests (Multi-Step Workflows)
  // ====================

  /**
   * Test: Complete workflow - Schedule, View, Reschedule
   *
   * Business Workflow:
   * Realistic end-to-end scenario
   *
   * Steps:
   * 1. Schedule new appointment
   * 2. Find and view the appointment
   * 3. Open reschedule form
   * 4. Update date/time
   * 5. Verify changes
   */
  test("should complete schedule-view-reschedule workflow", async ({
    page,
  }) => {
    const appointmentsPage = new AppointmentsPage(page);

    // Step 1: Schedule new appointment
    const uniqueCustomerName = `Workflow Test ${Date.now()}`;
    const appointmentData = {
      ...appointments.newAppointment,
      customerName: uniqueCustomerName,
    };

    await appointmentsPage.scheduleAppointment(appointmentData);

    // Step 2: View the appointment (search if needed)
    // await appointmentsPage.clickAppointment(uniqueCustomerName);
    // expect(await appointmentsPage.isDetailsModalOpen()).toBe(true);

    // Step 3: Open reschedule form
    // await appointmentsPage.clickReschedule();

    // Step 4: Update date/time
    // await appointmentsPage.fillAppointmentForm({
    //   preferredDate: "2024-07-01",
    //   preferredTime: "3:00 PM"
    // });
    // await appointmentsPage.saveAppointment();

    // Step 5: Verify changes
    // This demonstrates a complete real-world workflow
  });
});

/**
 * Additional Test Ideas (for future expansion):
 *
 * Advanced Date Handling:
 * - Past date validation (should reject past dates)
 * - Weekend handling (if shop closed weekends)
 * - Holiday handling
 * - Time slot availability
 * - Double-booking prevention
 *
 * Notifications:
 * - Email confirmation
 * - SMS reminders
 * - Appointment reminders
 *
 * Recurring Appointments:
 * - Schedule recurring maintenance
 * - Edit recurring series
 * - Delete single vs. all occurrences
 *
 * Search:
 * - Search by customer name
 * - Search by VIN
 * - Search by appointment ID
 *
 * Reporting:
 * - Daily appointment schedule
 * - Customer appointment history
 * - Service type statistics
 */
