/**
 * Appointments Page Object
 *
 * Represents the DMS Appointments scheduling and management page.
 *
 * Responsibilities:
 * - Schedule new appointments
 * - View existing appointments
 * - Update/reschedule appointments
 * - Cancel appointments
 * - Calendar/date interaction
 *
 * Demonstrates:
 * - Date/time input handling
 * - Multi-step form workflows
 * - Calendar interaction patterns
 */

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AppointmentsPage extends BasePage {
  protected readonly path = "/appointments";

  // ====================
  // Locators - Appointment List/Calendar
  // ====================

  // View toggle buttons
  private readonly listViewButton: Locator;
  private readonly calendarViewButton: Locator;

  // List view elements
  private readonly appointmentsList: Locator;
  private readonly appointmentItems: Locator;

  // Calendar view elements
  private readonly calendar: Locator;
  private readonly calendarDays: Locator;
  private readonly currentMonthLabel: Locator;
  private readonly nextMonthButton: Locator;
  private readonly previousMonthButton: Locator;

  // Filter controls
  private readonly dateFilterInput: Locator;
  private readonly serviceTypeFilter: Locator;
  private readonly statusFilter: Locator;

  // ====================
  // Locators - Create/Schedule Form
  // ====================

  // Action buttons
  private readonly scheduleNewButton: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly rescheduleButton: Locator;
  private readonly cancelAppointmentButton: Locator;

  // Form fields - Customer Information
  private readonly customerNameInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly emailInput: Locator;

  // Form fields - Appointment Details
  private readonly serviceTypeDropdown: Locator;
  private readonly vehicleVinInput: Locator;
  private readonly preferredDateInput: Locator;
  private readonly preferredTimeDropdown: Locator;
  private readonly notesTextarea: Locator;

  // Form validation
  private readonly formErrorMessage: Locator;
  private readonly phoneNumberError: Locator;
  private readonly emailError: Locator;

  // ====================
  // Locators - Appointment Details Modal
  // ====================

  private readonly detailsModal: Locator;
  private readonly detailsAppointmentId: Locator;
  private readonly detailsCustomerName: Locator;
  private readonly detailsServiceType: Locator;
  private readonly detailsScheduledDate: Locator;
  private readonly detailsScheduledTime: Locator;
  private readonly detailsStatus: Locator;
  private readonly closeModalButton: Locator;

  // ====================
  // Locators - Confirmation Dialogs
  // ====================

  private readonly confirmationDialog: Locator;
  private readonly confirmButton: Locator;
  private readonly declineButton: Locator;
  private readonly successNotification: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize view toggle locators
    this.listViewButton = this.page.locator('button:has-text("List View"), [data-view="list"]');
    this.calendarViewButton = this.page.locator('button:has-text("Calendar View"), [data-view="calendar"]');

    // Initialize list view locators
    this.appointmentsList = this.page.locator('.appointments-list, [role="list"]');
    this.appointmentItems = this.appointmentsList.locator('.appointment-item, [role="listitem"]');

    // Initialize calendar locators
    this.calendar = this.page.locator('.calendar, [role="calendar"]');
    this.calendarDays = this.calendar.locator('.calendar-day, [role="gridcell"]');
    this.currentMonthLabel = this.calendar.locator('.month-label, .current-month');
    this.nextMonthButton = this.calendar.locator('button:has-text("Next"), .next-month');
    this.previousMonthButton = this.calendar.locator('button:has-text("Previous"), .prev-month');

    // Initialize filter locators
    this.dateFilterInput = this.page.locator('input[name="dateFilter"], #date-filter');
    this.serviceTypeFilter = this.page.locator('select[name="serviceType"]');
    this.statusFilter = this.page.locator('select[name="status"]');

    // Initialize action button locators
    this.scheduleNewButton = this.page.locator('button:has-text("Schedule New"), button:has-text("New Appointment")');
    this.saveButton = this.page.locator('button:has-text("Save"), button[type="submit"]');
    this.cancelButton = this.page.locator('button:has-text("Cancel"):not(.cancel-appointment)');
    this.rescheduleButton = this.page.locator('button:has-text("Reschedule")');
    this.cancelAppointmentButton = this.page.locator('button:has-text("Cancel Appointment"), .cancel-appointment');

    // Initialize form field locators - Customer info
    this.customerNameInput = this.page.locator('input[name="customerName"]');
    this.phoneNumberInput = this.page.locator('input[name="phoneNumber"], input[type="tel"]');
    this.emailInput = this.page.locator('input[name="email"], input[type="email"]');

    // Initialize form field locators - Appointment details
    this.serviceTypeDropdown = this.page.locator('select[name="serviceType"]');
    this.vehicleVinInput = this.page.locator('input[name="vehicleVin"]');
    this.preferredDateInput = this.page.locator('input[name="preferredDate"], input[type="date"]');
    this.preferredTimeDropdown = this.page.locator('select[name="preferredTime"]');
    this.notesTextarea = this.page.locator('textarea[name="notes"]');

    // Initialize validation error locators
    this.formErrorMessage = this.page.locator('.form-error, .alert-danger');
    this.phoneNumberError = this.page.locator('#phone-error, [data-error="phoneNumber"]');
    this.emailError = this.page.locator('#email-error, [data-error="email"]');

    // Initialize details modal locators
    this.detailsModal = this.page.locator('.appointment-details, [role="dialog"]');
    this.detailsAppointmentId = this.detailsModal.locator('.appointment-id, [data-field="appointmentId"]');
    this.detailsCustomerName = this.detailsModal.locator('.customer-name, [data-field="customerName"]');
    this.detailsServiceType = this.detailsModal.locator('.service-type, [data-field="serviceType"]');
    this.detailsScheduledDate = this.detailsModal.locator('.scheduled-date, [data-field="scheduledDate"]');
    this.detailsScheduledTime = this.detailsModal.locator('.scheduled-time, [data-field="scheduledTime"]');
    this.detailsStatus = this.detailsModal.locator('.status, [data-field="status"]');
    this.closeModalButton = this.detailsModal.locator('button:has-text("Close"), .close-button');

    // Initialize confirmation dialog locators
    this.confirmationDialog = this.page.locator('[role="alertdialog"], .confirmation-dialog');
    this.confirmButton = this.confirmationDialog.locator('button:has-text("Confirm"), button:has-text("Yes")');
    this.declineButton = this.confirmationDialog.locator('button:has-text("No"), button:has-text("Cancel")');
    this.successNotification = this.page.locator('.success-notification, .toast-success');
  }

  // ====================
  // View Toggle Methods
  // ====================

  /**
   * Switch to list view
   */
  async switchToListView(): Promise<void> {
    await this.click(this.listViewButton);
    await this.waitForElement(this.appointmentsList);
  }

  /**
   * Switch to calendar view
   */
  async switchToCalendarView(): Promise<void> {
    await this.click(this.calendarViewButton);
    await this.waitForElement(this.calendar);
  }

  // ====================
  // Appointment List Methods
  // ====================

  /**
   * Get count of appointments in list view
   * @returns Number of appointments displayed
   */
  async getAppointmentCount(): Promise<number> {
    return await this.getElementCount(this.appointmentItems);
  }

  /**
   * Click on a specific appointment by customer name
   * @param customerName - Customer name to find
   */
  async clickAppointment(customerName: string): Promise<void> {
    const appointment = this.page.locator(`.appointment-item:has-text("${customerName}")`);
    await this.click(appointment);
    await this.waitForElement(this.detailsModal);
  }

  // ====================
  // Calendar Methods
  // ====================

  /**
   * Get current month displayed in calendar
   * @returns Month label (e.g., "January 2024")
   */
  async getCurrentMonth(): Promise<string> {
    return await this.getText(this.currentMonthLabel);
  }

  /**
   * Navigate to next month in calendar
   */
  async goToNextMonth(): Promise<void> {
    await this.click(this.nextMonthButton);
    await this.wait(500); // Wait for calendar to update
  }

  /**
   * Navigate to previous month in calendar
   */
  async goToPreviousMonth(): Promise<void> {
    await this.click(this.previousMonthButton);
    await this.wait(500);
  }

  /**
   * Click on a specific date in the calendar
   * @param day - Day of the month (1-31)
   */
  async clickCalendarDay(day: number): Promise<void> {
    const dayCell = this.page.locator(`.calendar-day:has-text("${day}")`).first();
    await this.click(dayCell);
  }

  // ====================
  // Filter Methods
  // ====================

  /**
   * Filter appointments by service type
   * @param serviceType - Service type (e.g., "Oil Change", "Maintenance")
   */
  async filterByServiceType(serviceType: string): Promise<void> {
    await this.selectDropdown(this.serviceTypeFilter, serviceType);
    await this.waitForPageLoad();
  }

  /**
   * Filter appointments by status
   * @param status - Status (e.g., "Scheduled", "Completed", "Cancelled")
   */
  async filterByStatus(status: string): Promise<void> {
    await this.selectDropdown(this.statusFilter, status);
    await this.waitForPageLoad();
  }

  /**
   * Filter appointments by date
   * @param date - Date in YYYY-MM-DD format
   */
  async filterByDate(date: string): Promise<void> {
    await this.fill(this.dateFilterInput, date);
    await this.waitForPageLoad();
  }

  // ====================
  // Create/Schedule Appointment Methods
  // ====================

  /**
   * Click "Schedule New Appointment" button
   */
  async clickScheduleNew(): Promise<void> {
    await this.click(this.scheduleNewButton);
    await this.wait(500); // Wait for form to appear
  }

  /**
   * Fill out the appointment scheduling form
   *
   * @param appointmentData - Appointment details
   */
  async fillAppointmentForm(appointmentData: {
    customerName?: string;
    phoneNumber?: string;
    email?: string;
    serviceType?: string;
    vehicleVin?: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
  }): Promise<void> {
    if (appointmentData.customerName) {
      await this.fill(this.customerNameInput, appointmentData.customerName);
    }
    if (appointmentData.phoneNumber) {
      await this.fill(this.phoneNumberInput, appointmentData.phoneNumber);
    }
    if (appointmentData.email) {
      await this.fill(this.emailInput, appointmentData.email);
    }
    if (appointmentData.serviceType) {
      await this.selectDropdown(this.serviceTypeDropdown, appointmentData.serviceType);
    }
    if (appointmentData.vehicleVin) {
      await this.fill(this.vehicleVinInput, appointmentData.vehicleVin);
    }
    if (appointmentData.preferredDate) {
      await this.fill(this.preferredDateInput, appointmentData.preferredDate);
    }
    if (appointmentData.preferredTime) {
      await this.selectDropdown(this.preferredTimeDropdown, appointmentData.preferredTime);
    }
    if (appointmentData.notes) {
      await this.fill(this.notesTextarea, appointmentData.notes);
    }
  }

  /**
   * Save the appointment form
   */
  async saveAppointment(): Promise<void> {
    await this.click(this.saveButton);
    await this.waitForPageLoad();
  }

  /**
   * Cancel the appointment form
   */
  async cancelForm(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Create a new appointment (complete workflow)
   * Combines: click schedule → fill form → save
   *
   * @param appointmentData - Appointment details
   */
  async scheduleAppointment(appointmentData: {
    customerName: string;
    phoneNumber: string;
    email: string;
    serviceType: string;
    vehicleVin: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }): Promise<void> {
    await this.clickScheduleNew();
    await this.fillAppointmentForm(appointmentData);
    await this.saveAppointment();
  }

  // ====================
  // Update/Cancel Appointment Methods
  // ====================

  /**
   * Click the "Reschedule" button in appointment details
   */
  async clickReschedule(): Promise<void> {
    await this.click(this.rescheduleButton);
    await this.wait(500); // Wait for reschedule form
  }

  /**
   * Cancel an appointment (opens confirmation dialog)
   */
  async clickCancelAppointment(): Promise<void> {
    await this.click(this.cancelAppointmentButton);
    await this.waitForElement(this.confirmationDialog);
  }

  /**
   * Confirm cancellation in dialog
   */
  async confirmCancellation(): Promise<void> {
    await this.click(this.confirmButton);
    await this.waitForPageLoad();
  }

  /**
   * Decline cancellation in dialog
   */
  async declineCancellation(): Promise<void> {
    await this.click(this.declineButton);
  }

  // ====================
  // Validation Methods
  // ====================

  /**
   * Get form error message
   * @returns Error message text
   */
  async getFormError(): Promise<string> {
    return await this.getText(this.formErrorMessage);
  }

  /**
   * Get phone number validation error
   * @returns Phone error text
   */
  async getPhoneNumberError(): Promise<string> {
    return await this.getText(this.phoneNumberError);
  }

  /**
   * Get email validation error
   * @returns Email error text
   */
  async getEmailError(): Promise<string> {
    return await this.getText(this.emailError);
  }

  /**
   * Check if form has validation errors
   * @returns true if error is visible
   */
  async hasFormError(): Promise<boolean> {
    return await this.isVisible(this.formErrorMessage);
  }

  /**
   * Check if success notification is displayed
   * @returns true if success notification is visible
   */
  async hasSuccessNotification(): Promise<boolean> {
    return await this.isVisible(this.successNotification);
  }

  // ====================
  // Details Modal Methods
  // ====================

  /**
   * Check if appointment details modal is open
   * @returns true if modal is visible
   */
  async isDetailsModalOpen(): Promise<boolean> {
    return await this.isVisible(this.detailsModal);
  }

  /**
   * Get appointment ID from details modal
   * @returns Appointment ID string
   */
  async getDetailsAppointmentId(): Promise<string> {
    return await this.getText(this.detailsAppointmentId);
  }

  /**
   * Get customer name from details modal
   * @returns Customer name string
   */
  async getDetailsCustomerName(): Promise<string> {
    return await this.getText(this.detailsCustomerName);
  }

  /**
   * Get scheduled date from details modal
   * @returns Date string
   */
  async getDetailsScheduledDate(): Promise<string> {
    return await this.getText(this.detailsScheduledDate);
  }

  /**
   * Get scheduled time from details modal
   * @returns Time string
   */
  async getDetailsScheduledTime(): Promise<string> {
    return await this.getText(this.detailsScheduledTime);
  }

  /**
   * Get status from details modal
   * @returns Status string
   */
  async getDetailsStatus(): Promise<string> {
    return await this.getText(this.detailsStatus);
  }

  /**
   * Close the appointment details modal
   */
  async closeDetailsModal(): Promise<void> {
    await this.click(this.closeModalButton);
    await this.waitForElementToDisappear(this.detailsModal);
  }
}
