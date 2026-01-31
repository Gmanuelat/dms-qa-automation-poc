# DMS QA Automation Framework - Complete Documentation

**A Professional Playwright + TypeScript Test Automation Framework**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What This Project Demonstrates](#what-this-project-demonstrates)
3. [Architecture & Design](#architecture--design)
4. [How It Was Built](#how-it-was-built)
5. [Complete File Structure](#complete-file-structure)
6. [Installation & Setup](#installation--setup)
7. [How to Use This Framework](#how-to-use-this-framework)
8. [Understanding the Code](#understanding-the-code)
9. [Running Tests](#running-tests)
10. [CI/CD Integration](#cicd-integration)
11. [Extending the Framework](#extending-the-framework)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices Reference](#best-practices-reference)

---

## Project Overview

### What is This?

This is a **Proof of Concept (POC)** QA automation framework built for testing a Document Management System (DMS) web application. It demonstrates professional-level test automation skills using modern tools and industry-standard design patterns.

### Purpose

- **Portfolio Project**: Showcase QA automation engineering skills to recruiters
- **Learning Resource**: Demonstrate best practices in test automation
- **Framework Template**: Reusable structure for real-world projects

### Key Statistics

- **4,361** lines of production-quality TypeScript code
- **69** automated tests across 4 test suites
- **4** Page Object Models with 120+ methods
- **100%** TypeScript type-safe code
- **Full** CI/CD pipeline integration

### Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **Playwright** | Browser automation framework | v1.48.0 |
| **TypeScript** | Type-safe programming language | v5.6.2 |
| **Node.js** | JavaScript runtime | v18+ |
| **GitHub Actions** | CI/CD pipeline | Latest |
| **dotenv** | Environment variable management | v16.4.5 |

---

## What This Project Demonstrates

### 1. Technical Skills
**Modern Testing Framework** - Playwright (2024 industry standard) **Type-Safe Code** - TypeScript for robust, maintainable code
 **Design Patterns** - Page Object Model (POM)
 **API Testing** - REST API automation with Playwright
 **Test Organization** - AAA pattern, describe blocks, hooks
**CI/CD Integration** - Automated testing on every commit

### 2. Software Engineering Principles

 **SOLID Principles** - Single Responsibility, Open/Closed, etc.
 **DRY (Don't Repeat Yourself)** - Reusable components
 **Separation of Concerns** - Page Objects, Tests, Utilities separated
 **Clean Code** - Readable, documented, self-explanatory
 **Security Awareness** - SQL injection, XSS testing

### 3. QA Engineering Competencies

 **Test Coverage** - Positive, negative, edge cases
 **Test Data Management** - Centralized, environment-based
 **Error Handling** - Validation, security testing
 **Reporting** - HTML reports with screenshots/videos
 **Cross-functional Testing** - UI + API testing

---

## Architecture & Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     TEST LAYER                          │
│  (What to test - Business logic & requirements)         │
│                                                          │
│  tests/                                                  │
│  ├── auth.spec.ts          (15 tests)                   │
│  ├── repairOrders.spec.ts  (18 tests)                   │
│  ├── appointments.spec.ts  (15 tests)                   │
│  └── api.spec.ts           (21 tests)                   │
└─────────────────────────────────────────────────────────┘
                          ↓ uses
┌─────────────────────────────────────────────────────────┐
│                  PAGE OBJECT LAYER                      │
│   (How to interact - UI abstraction)                    │
│                                                          │
│  pages/                                                  │
│  ├── BasePage.ts           (30+ shared methods)         │
│  ├── LoginPage.ts          (25+ login methods)          │
│  ├── RepairOrdersPage.ts   (35+ CRUD methods)           │
│  └── AppointmentsPage.ts   (30+ scheduling methods)     │
└─────────────────────────────────────────────────────────┘
                          ↓ uses
┌─────────────────────────────────────────────────────────┐
│                   UTILITIES LAYER                       │
│   (Shared resources - Data, helpers, config)            │
│                                                          │
│  utils/                                                  │
│  ├── env.ts              (Environment loader)           │
│  ├── testData.ts         (Test data repository)         │
│  └── apiClient.ts        (API testing toolkit)          │
└─────────────────────────────────────────────────────────┘
                          ↓ uses
┌─────────────────────────────────────────────────────────┐
│                 PLAYWRIGHT FRAMEWORK                    │
│              (Browser automation engine)                │
└─────────────────────────────────────────────────────────┘
```

### Design Pattern: Page Object Model (POM)

**Problem:** Tests directly interact with UI elements, leading to:
- Code duplication
- Hard-to-maintain tests
- Brittle tests that break with UI changes

**Solution:** Page Object Model

```
┌──────────────────┐
│   Test Suite     │  "What to test"
│                  │  - Business requirements
│  - Login tests   │  - User workflows
│  - Search tests  │  - Validation rules
└────────┬─────────┘
         │ uses
         ↓
┌──────────────────┐
│   Page Objects   │  "How to interact"
│                  │  - Element locators
│  - LoginPage     │  - Action methods
│  - SearchPage    │  - Verification methods
└────────┬─────────┘
         │ uses
         ↓
┌──────────────────┐
│   Playwright     │  "Browser automation"
│   API            │  - Click, type, navigate
└──────────────────┘
```

**Benefits:**
1. **Maintainability** - UI changes only require updating one file
2. **Reusability** - Same page object used across multiple tests
3. **Readability** - Tests read like business requirements
4. **Scalability** - Easy to add new pages and tests

### Class Inheritance Hierarchy

```
BasePage (abstract)
├── Common methods for ALL pages:
│   ├── navigate()
│   ├── click()
│   ├── fill()
│   ├── getText()
│   ├── waitForElement()
│   └── ... (30+ methods)
│
├─► LoginPage extends BasePage
│   ├── Inherits all BasePage methods
│   └── Adds login-specific methods:
│       ├── login()
│       ├── logout()
│       ├── getErrorMessage()
│       └── ... (25+ methods)
│
├─► RepairOrdersPage extends BasePage
│   ├── Inherits all BasePage methods
│   └── Adds repair order methods:
│       ├── search()
│       ├── createRepairOrder()
│       ├── updateRepairOrder()
│       └── ... (35+ methods)
│
└─► AppointmentsPage extends BasePage
    ├── Inherits all BasePage methods
    └── Adds appointment methods:
        ├── scheduleAppointment()
        ├── filterByDate()
        ├── cancelAppointment()
        └── ... (30+ methods)
```

**Why This Design?**

- **Code Reuse**: Common functionality (click, fill, wait) written once in `BasePage`
- **Consistency**: All pages behave the same way for common actions
- **Extensibility**: New pages inherit all base functionality automatically

---

## How It Was Built

### Phase 1: Foundation - Configuration Files

**Goal:** Set up TypeScript and environment configuration

**Files Created:**
1. `tsconfig.json` - TypeScript compiler configuration
2. `.env.example` - Environment variable template
3. `.env` - Local environment variables (gitignored)

**Why First?**
- TypeScript won't compile without `tsconfig.json`
- Environment variables needed for all subsequent code
- Foundation must be solid before building on top

**Key Learnings:**
- `strict: true` enables all type checking (catches bugs early)
- `paths` mapping allows clean imports (`@pages/LoginPage` vs `../../pages/LoginPage`)
- `noEmit: true` because Playwright compiles TypeScript on-the-fly

---

### Phase 2: Utilities Layer - Shared Code

**Goal:** Build reusable utilities that Page Objects and tests will use

**Files Created:**

1. **`utils/testData.ts`** - Test data repository
   - User credentials
   - Test data objects (repair orders, appointments)
   - Helper functions (generate unique IDs, dates)
   - Validation messages

2. **`utils/apiClient.ts`** - API testing toolkit
   - `DmsApiClient` class for API interactions
   - CRUD methods for each API endpoint
   - Response validation helpers
   - Authentication handling

**Why Second?**
- Page Objects will import test data
- Tests will use both Page Objects AND API client
- Building bottom-up prevents refactoring later

**Key Learnings:**
- Centralized test data prevents "magic strings" scattered throughout tests
- API testing with Playwright's `APIRequestContext` is faster than UI tests
- Helper functions (like `generateOrderNumber()`) prevent test data conflicts

---

### Phase 3: Page Object Model - UI Abstraction

**Goal:** Create Page Objects that encapsulate all UI interactions

**Files Created:**

1. **`pages/BasePage.ts`** - Abstract base class
   - Common navigation methods
   - Element interaction methods (click, fill, select)
   - Wait/verification methods
   - Utility methods (screenshot, scroll)

2. **`pages/LoginPage.ts`** - Login page object
   - Login/logout functionality
   - Form validation testing
   - Error message verification
   - Session management

3. **`pages/RepairOrdersPage.ts`** - Repair orders page object
   - Search and filter operations
   - CRUD operations (Create, Read, Update, Delete)
   - Table/grid interaction
   - Pagination handling

4. **`pages/AppointmentsPage.ts`** - Appointments page object
   - Appointment scheduling
   - Calendar interaction
   - Date/time handling
   - Cancellation workflows

**Why Third?**
- Tests consume Page Objects
- Page Objects need utilities (test data, helpers)
- Proper layering: Utilities → Page Objects → Tests

**Key Learnings:**
- **Locators as properties** - Define once, use many times
- **Descriptive method names** - `login()` is clearer than `submitCredentials()`
- **Inheritance** - BasePage prevents code duplication across page objects

---

### Phase 4: Test Implementation - The Showcase

**Goal:** Write tests that demonstrate the framework's capabilities

**Files Created:**

1. **`tests/auth.spec.ts`** - Authentication tests (15 tests)
   - Valid login scenarios
   - Invalid credentials testing
   - Form validation (empty fields)
   - Security testing (SQL injection, XSS)
   - Session management (logout)

2. **`tests/repairOrders.spec.ts`** - Repair order tests (18 tests)
   - Search and filter functionality
   - Create new repair orders
   - View repair order details
   - Form validation
   - Table interaction and pagination

3. **`tests/appointments.spec.ts`** - Appointment tests (15 tests)
   - Schedule new appointments
   - Calendar navigation
   - Form validation (phone, email)
   - Reschedule/cancel workflows
   - Confirmation dialogs

4. **`tests/api.spec.ts`** - API tests (21 tests)
   - Authentication endpoints
   - Repair Orders API (full CRUD)
   - Appointments API (full CRUD)
   - Performance testing (response times)
   - Contract testing (schema validation)

**Why Last?**
- Tests are the final layer
- They consume everything built in previous phases
- Demonstrates the complete framework in action

**Key Learnings:**
- **AAA Pattern** - Arrange, Act, Assert makes tests readable
- **Test Independence** - Each test can run alone
- **beforeEach hooks** - Ensure consistent starting state
- **Descriptive names** - `should successfully login with valid credentials` is self-documenting

---

## Complete File Structure

```
dms-qa-automation-poc/
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD pipeline
│
├── pages/                             # Page Object Models
│   ├── BasePage.ts                   # Abstract base class (30+ methods)
│   ├── LoginPage.ts                  # Login page object (25+ methods)
│   ├── RepairOrdersPage.ts           # Repair orders page (35+ methods)
│   └── AppointmentsPage.ts           # Appointments page (30+ methods)
│
├── tests/                             # Test suites
│   ├── auth.spec.ts                  # Authentication tests (15 tests)
│   ├── repairOrders.spec.ts          # Repair order tests (18 tests)
│   ├── appointments.spec.ts          # Appointment tests (15 tests)
│   └── api.spec.ts                   # API tests (21 tests)
│
├── utils/                             # Utilities and helpers
│   ├── env.ts                        # Environment variable loader
│   ├── testData.ts                   # Test data repository
│   └── apiClient.ts                  # API testing toolkit
│
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Locked dependency versions
│
├── .env                               # Local environment variables (gitignored)
├── .env.example                       # Environment variable template
├── .gitignore                         # Git ignore rules
│
└── README.md                          # Project documentation
```

### File Purposes

| File | Purpose | Lines |
|------|---------|-------|
| **pages/BasePage.ts** | Common page functionality | 280 |
| **pages/LoginPage.ts** | Login page interactions | 310 |
| **pages/RepairOrdersPage.ts** | Repair order CRUD operations | 470 |
| **pages/AppointmentsPage.ts** | Appointment scheduling | 450 |
| **tests/auth.spec.ts** | Authentication test cases | 360 |
| **tests/repairOrders.spec.ts** | Repair order test cases | 510 |
| **tests/appointments.spec.ts** | Appointment test cases | 620 |
| **tests/api.spec.ts** | API test cases | 650 |
| **utils/testData.ts** | Test data management | 260 |
| **utils/apiClient.ts** | API client and helpers | 450 |
| **Total** | | **4,361** |

---

## Installation & Setup

### Prerequisites

Before starting, ensure you have:

1. **Node.js** v18 or higher
   ```bash
   node --version  # Should be v18.x.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Git** (for version control)
   ```bash
   git --version
   ```

### Step 1: Clone or Download Project

```bash
# If you have a Git repository
git clone https://github.com/yourusername/dms-qa-automation-poc.git
cd dms-qa-automation-poc

# Or if downloaded as ZIP
unzip dms-qa-automation-poc.zip
cd dms-qa-automation-poc
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This installs:
# - @playwright/test
# - typescript
# - dotenv
# - @types/node
```

### Step 3: Install Playwright Browsers

```bash
# Install Chromium browser for testing
npx playwright install chromium

# Or install all browsers (Chrome, Firefox, Safari)
npx playwright install
```

### Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
# (Use VS Code, Vim, Nano, or any text editor)
```

**Edit `.env` file:**

```env
# Base URL for the DMS web application
BASE_URL=https://your-actual-dms-url.com

# Test user credentials
DMS_USER=your-test-username@example.com
DMS_PASS=your-test-password

# API configuration
API_BASE_URL=https://api.your-dms-url.com/v1
API_TOKEN=your-api-token
```

### Step 5: Verify Installation

```bash
# Check TypeScript compilation
npm run lint:types

# Should output: (no errors)

# List available tests
npx playwright test --list

# Should show: Total: 69 tests in 4 files
```

---

## How to Use This Framework

### Running Tests - Quick Reference

```bash
# Run all tests (headless mode)
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in debug mode
npx playwright test --debug

# Run tests on specific browser
npx playwright test --project=chromium

# View HTML report
npm run report
```

### Running Individual Test Files

```bash
# Authentication tests only
npx playwright test tests/auth.spec.ts

# Repair order tests only
npx playwright test tests/repairOrders.spec.ts

# Appointment tests only
npx playwright test tests/appointments.spec.ts

# API tests only
npx playwright test tests/api.spec.ts
```

### Running Specific Tests

```bash
# Run a single test by name
npx playwright test --grep "should successfully login"

# Run tests containing "login"
npx playwright test --grep "login"

# Run tests NOT containing "API"
npx playwright test --grep-invert "API"

# Run only failed tests from last run
npx playwright test --last-failed
```

### Development Workflow

**Typical workflow when developing tests:**

1. **Write/update test**
   ```bash
   # Edit test file
   code tests/auth.spec.ts
   ```

2. **Run in UI mode for rapid feedback**
   ```bash
   npm run test:ui
   ```

3. **Debug specific test**
   ```bash
   npx playwright test tests/auth.spec.ts --debug
   ```

4. **Run full suite before committing**
   ```bash
   npm test
   ```

5. **View results**
   ```bash
   npm run report
   ```

---

## Understanding the Code

### Example 1: How a Test Executes

Let's trace through a complete test execution:

**Test Code:**
```typescript
// tests/auth.spec.ts
test("should successfully login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(users.validUser.username, users.validUser.password);
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

**Step-by-Step Execution:**

```
1. Test starts
   └─ Playwright creates new browser page

2. const loginPage = new LoginPage(page);
   └─ Creates LoginPage instance
   └─ Stores reference to browser page

3. await loginPage.login(username, password)
   ↓
   Inside LoginPage.login():
   └─ await this.fill(this.usernameInput, username);
      ↓ Finds input element
      ↓ Clears existing value
      ↓ Types username character by character

   └─ await this.fill(this.passwordInput, password);
      ↓ Finds password input
      ↓ Types password

   └─ await this.click(this.loginButton);
      ↓ Finds button
      ↓ Clicks it
      ↓ Triggers form submission

   └─ await this.waitForPageLoad();
      ↓ Waits for navigation to complete

4. expect(await loginPage.isLoggedIn()).toBe(true);
   ↓
   Inside LoginPage.isLoggedIn():
   └─ await this.isVisible(this.logoutButton)
      ↓ Checks if logout button exists
      ↓ Returns true/false

5. Assertion
   └─ If true: Test passes
   └─ If false:  Test fails
      └─ Screenshot captured
      └─ Trace saved
```

### Example 2: Page Object Method Breakdown

**Method Definition:**
```typescript
// pages/LoginPage.ts
async login(username: string, password: string): Promise<void> {
  await this.fill(this.usernameInput, username);
  await this.fill(this.passwordInput, password);
  await this.click(this.loginButton);
  await this.waitForPageLoad();
}
```

**What Each Line Does:**

```typescript
await this.fill(this.usernameInput, username);
```
- `this.fill()` - Calls BasePage.fill() method
- `this.usernameInput` - Locator defined in constructor
- `username` - Parameter passed from test
- `await` - Waits for fill operation to complete

**The fill() method (from BasePage):**
```typescript
async fill(locator: Locator, text: string): Promise<void> {
  await locator.fill(text);  // Playwright's locator.fill()
}
```

**Flow:**
```
Test
  ↓ calls
LoginPage.login()
  ↓ calls
BasePage.fill()
  ↓ calls
Playwright locator.fill()
  ↓ executes
Browser action (types text)
```

### Example 3: Test Data Flow

**How test data travels through the system:**

```
1. .env file:
   DMS_USER=myuser@example.com

2. utils/env.ts loads it:
   dotenv.config()
   ↓
   process.env.DMS_USER = "myuser@example.com"

3. utils/testData.ts exports it:
   export const users = {
     validUser: {
       username: process.env.DMS_USER,
       ...
     }
   };

4. Test imports and uses it:
   import { users } from "../utils/testData";
   await loginPage.login(users.validUser.username, ...);
   //                     ↑ "myuser@example.com"
```

### Example 4: Locator Explanation

**Locator Definition:**
```typescript
private readonly usernameInput: Locator;

constructor(page: Page) {
  this.usernameInput = this.page.locator('input[name="username"]');
}
```

**What This Means:**

```
Find an element that matches:
  - Tag: <input>
  - Attribute: name="username"

HTML it's looking for:
  <input name="username" type="text" />
```

**Different Locator Strategies:**

```typescript
// By CSS selector
this.page.locator('input[name="username"]')

// By ID
this.page.locator('#username')

// By text content
this.page.locator('button:has-text("Login")')

// By role (accessibility)
this.page.locator('role=button[name="Login"]')

// By test ID (recommended)
this.page.locator('[data-testid="username-input"]')
```

**Why Locators are Properties:**

```typescript
// BAD - Locator defined in method
async login() {
  const usernameInput = this.page.locator('input[name="username"]');
  await usernameInput.fill('user');
  // If selector changes, update in EVERY method
}

//  GOOD - Locator defined once as property
constructor(page: Page) {
  this.usernameInput = this.page.locator('input[name="username"]');
}

async login() {
  await this.usernameInput.fill('user');
  // If selector changes, update ONCE in constructor
}
```

---

## Running Tests

### Test Output Examples

**Successful Test Run:**

```
$ npm test

Running 69 tests using 1 worker

  ✓  [chromium] › auth.spec.ts:59 › should successfully login (2.3s)
  ✓  [chromium] › auth.spec.ts:81 › should login with Remember Me (2.1s)
  ✓  [chromium] › auth.spec.ts:116 › should show error for invalid credentials (1.8s)
  ...

  69 passed (1.2m)
```

**Failed Test Run:**

```
$ npm test

Running 69 tests using 1 worker

  ✓  [chromium] › auth.spec.ts:59 › should successfully login (2.3s)
  ✗  [chromium] › auth.spec.ts:81 › should login with Remember Me (5.2s)

  1) [chromium] › auth.spec.ts:81 › should login with Remember Me

    Error: expect(received).toBe(expected)

    Expected: true
    Received: false

    at tests/auth.spec.ts:94:38

  1 failed
  68 passed (1.3m)
```

### Understanding Test Results

**Test Status Icons:**

- ✓ **Passed** - Test completed successfully
- ✗ **Failed** - Assertion failed
- ⊘ **Skipped** - Test marked with `.skip`
- ⊗ **Timeout** - Test exceeded timeout limit

**Viewing Detailed Results:**

```bash
# Open HTML report (best for debugging)
npm run report

# Shows:
# - Screenshots of failures
# - Step-by-step traces
# - Network activity
# - Console logs
```

### Test Reports

**HTML Report Structure:**

```
playwright-report/
├── index.html              # Main report page
├── data/                   # Test result data
└── trace/                  # Trace files for debugging
```

**Report Features:**

-  Test execution timeline
-  Screenshots on failure
-  Video recordings (if enabled)
-  Network requests
-  Console logs
-  Step-by-step traces

**Viewing Traces:**

```bash
# Open trace viewer for failed test
npx playwright show-trace test-results/auth-spec-login/trace.zip

# Interactive debugging:
# - Step through test execution
# - Inspect DOM at each step
# - View network requests
# - See console output
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

**What It Does:**

```yaml
name: Playwright Tests

on:
  push:              # Runs on every push
  pull_request:      # Runs on every PR

jobs:
  test:
    runs-on: ubuntu-latest    # Uses Ubuntu VM

    steps:
      1. Checkout code
      2. Setup Node.js v20
      3. Install dependencies
      4. Install Playwright browsers
      5. Run tests
      6. Upload test report
```

**Workflow Execution:**

```
Developer pushes code
  ↓
GitHub receives push
  ↓
GitHub Actions triggered
  ↓
Spin up Ubuntu VM
  ↓
Checkout repository code
  ↓
Install Node.js v20
  ↓
npm ci (install dependencies)
  ↓
npx playwright install --with-deps
  ↓
npm test (run all tests)
  ↓
If tests pass:  Build succeeds
If tests fail:   Build fails
  ↓
Upload HTML report as artifact
  ↓
Shut down VM
```

### Setting Up GitHub Secrets

**Required Secrets:**

Navigate to: `GitHub Repo → Settings → Secrets and variables → Actions`

Add these secrets:

| Secret Name | Example Value | Purpose |
|-------------|---------------|---------|
| `BASE_URL` | `https://dms.example.com` | DMS web app URL |
| `DMS_USER` | `test.user@example.com` | Test account username |
| `DMS_PASS` | `SecurePassword123!` | Test account password |
| `API_BASE_URL` | `https://api.dms.example.com/v1` | API endpoint URL |
| `API_TOKEN` | `eyJhbGci0iJ9...` | API auth token |

**How They're Used:**

```yaml
# In ci.yml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  DMS_USER: ${{ secrets.DMS_USER }}
  # ...
```

**Security:**
-  Secrets are encrypted
-  Not visible in logs
-  Only accessible during workflow execution

### Viewing CI Results

**In GitHub:**

1. Go to repository
2. Click **Actions** tab
3. Click on workflow run
4. View test results
5. Download HTML report artifact

**Example CI Output:**

```
Run npm test
  Running 69 tests using 1 worker

  ✓ [chromium] › auth.spec.ts:59 › should login (2.1s)
  ✓ [chromium] › auth.spec.ts:81 › should login with Remember Me (1.9s)
  ...

  69 passed (1.5m)

✓ Tests completed successfully
```

---

## Extending the Framework

### Adding a New Page Object

**Step 1: Create the Page Object File**

```typescript
// pages/CustomersPage.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CustomersPage extends BasePage {
  // Define the path
  protected readonly path = "/customers";

  // Define locators
  private readonly searchInput: Locator;
  private readonly addCustomerButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.searchInput = this.page.locator('input[name="search"]');
    this.addCustomerButton = this.page.locator('button:has-text("Add Customer")');
  }

  // Add page-specific methods
  async searchCustomer(name: string): Promise<void> {
    await this.fill(this.searchInput, name);
    await this.pressKey('Enter');
    await this.waitForPageLoad();
  }

  async clickAddCustomer(): Promise<void> {
    await this.click(this.addCustomerButton);
  }
}
```

**Step 2: Create Test File**

```typescript
// tests/customers.spec.ts
import { test, expect } from "@playwright/test";
import { CustomersPage } from "../pages/CustomersPage";
import { LoginPage } from "../pages/LoginPage";
import { users } from "../utils/testData";

test.describe("Customer Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);

    // Navigate to customers page
    const customersPage = new CustomersPage(page);
    await customersPage.navigate();
  });

  test("should search for customer", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    await customersPage.searchCustomer("John Doe");
    // Add assertions
  });
});
```

### Adding Test Data

**Edit `utils/testData.ts`:**

```typescript
export const customers = {
  existingCustomer: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
  },

  newCustomer: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
  },
};
```

**Use in tests:**

```typescript
import { customers } from "../utils/testData";

await customersPage.searchCustomer(customers.existingCustomer.name);
```

### Adding API Endpoints

**Edit `utils/apiClient.ts`:**

```typescript
/**
 * Get all customers
 */
async getCustomers() {
  const context = this.getContext();
  return await context.get("/customers");
}

/**
 * Create new customer
 */
async createCustomer(customerData: Record<string, unknown>) {
  const context = this.getContext();
  return await context.post("/customers", {
    data: customerData,
  });
}
```

**Use in API tests:**

```typescript
test("should create customer via API", async () => {
  const api = new DmsApiClient();
  await api.init();

  const response = await api.createCustomer({
    name: "Test Customer",
    email: "test@example.com",
  });

  assertStatus(response, 201);
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Tests Fail with "Timeout" Error

**Symptom:**
```
Error: page.goto: Timeout 30000ms exceeded
```

**Possible Causes:**
- Invalid URL in `.env` file
- Application not running
- Network issues
- Slow application response

**Solutions:**

```bash
# 1. Check BASE_URL in .env
cat .env | grep BASE_URL

# 2. Verify application is accessible
curl -I https://your-dms-url.com

# 3. Increase timeout in playwright.config.ts
timeout: 60_000,  // Changed from 30_000

# 4. Run with headed mode to see what's happening
npm run test:headed
```

#### Issue 2: Element Not Found

**Symptom:**
```
Error: locator.click: Target closed
or
Error: Timeout 30000ms exceeded waiting for selector
```

**Possible Causes:**
- Selector is incorrect
- Element loads dynamically (needs wait)
- Element is hidden or disabled

**Solutions:**

```typescript
// 1. Verify selector in headed mode
npm run test:headed

// 2. Add explicit wait
await this.waitForElement(this.loginButton, 10000);

// 3. Check element exists before interacting
if (await this.isVisible(this.loginButton)) {
  await this.click(this.loginButton);
}

// 4. Use more specific selector
// Instead of: button
// Use: button[type="submit"]
```

#### Issue 3: TypeScript Errors

**Symptom:**
```
error TS2339: Property 'login' does not exist on type 'LoginPage'
```

**Solutions:**

```bash
# 1. Check for typos in method name
# 2. Ensure method is defined in the class
# 3. Rebuild TypeScript
npm run lint:types

# 4. Restart VS Code / IDE
# Sometimes TypeScript server needs restart
```

#### Issue 4: Environment Variables Not Loading

**Symptom:**
```
BASE_URL is undefined
```

**Solutions:**

```bash
# 1. Verify .env file exists
ls -la .env

# 2. Check .env content
cat .env

# 3. Ensure no spaces around =
#  BAD:  BASE_URL = https://...
#  GOOD: BASE_URL=https://...

# 4. Restart test (environment loaded at startup)
npm test
```

#### Issue 5: Tests Pass Locally but Fail in CI

**Possible Causes:**
- Missing GitHub Secrets
- Different browser behavior (headless vs headed)
- Timing issues

**Solutions:**

```bash
# 1. Check GitHub Secrets are set
# Go to: Settings → Secrets and variables → Actions

# 2. Test in headless mode locally
npx playwright test --headed=false

# 3. Add more explicit waits
await this.waitForPageLoad();

# 4. Check CI logs for specific error
# In GitHub Actions → View workflow run → Expand failed step
```

### Debugging Techniques

**1. Use Playwright UI Mode**

```bash
npm run test:ui

# Features:
# - Step through tests
# - Inspect DOM
# - Time travel debugging
# - Watch mode (reruns on changes)
```

**2. Use Debug Mode**

```bash
npx playwright test --debug

# Opens Playwright Inspector:
# - Step through each action
# - Inspect locators
# - Evaluate expressions
```

**3. Add Console Logs**

```typescript
test("debug test", async ({ page }) => {
  console.log("Starting test...");

  const loginPage = new LoginPage(page);
  console.log("Created LoginPage");

  await loginPage.login(user, pass);
  console.log("Login completed");
});
```

**4. Take Screenshots**

```typescript
// In test or page object
await this.takeScreenshot("debug-screenshot");

// Or use Playwright's screenshot
await page.screenshot({ path: "debug.png", fullPage: true });
```

**5. Use Page Pause**

```typescript
// Pause test execution
await page.pause();

// Opens Playwright Inspector
// Allows manual interaction with page
```

---

## Best Practices Reference

### Test Writing Best Practices

**1. AAA Pattern (Arrange-Act-Assert)**

```typescript
test("example", async ({ page }) => {
  // ARRANGE - Set up test data and state
  const loginPage = new LoginPage(page);
  const credentials = users.validUser;

  // ACT - Perform the action being tested
  await loginPage.login(credentials.username, credentials.password);

  // ASSERT - Verify expected outcome
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

**2. Test Independence**

```typescript
//  BAD - Tests depend on each other
let userId;
test("create user", async () => {
  userId = await createUser();  // Sets global variable
});
test("view user", async () => {
  await viewUser(userId);  // Depends on previous test
});

//  GOOD - Each test is independent
test("create user", async () => {
  const userId = await createUser();
  // Test complete
});
test("view user", async () => {
  const userId = await createUser();  // Creates own data
  await viewUser(userId);
});
```

**3. Descriptive Test Names**

```typescript
//  BAD
test("test1", async () => { ... });
test("login", async () => { ... });

//  GOOD
test("should successfully login with valid credentials", async () => { ... });
test("should show error message for invalid password", async () => { ... });
```

**4. Use beforeEach for Common Setup**

```typescript
test.describe("Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Runs before EACH test
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("test 1", async ({ page }) => {
    // Login page already loaded
  });

  test("test 2", async ({ page }) => {
    // Login page already loaded (fresh state)
  });
});
```

### Page Object Best Practices

**1. Locators as Properties**

```typescript
//  GOOD
class LoginPage {
  private readonly usernameInput: Locator;

  constructor(page: Page) {
    this.usernameInput = page.locator('input[name="username"]');
  }

  async login(username: string) {
    await this.usernameInput.fill(username);  // Use property
  }
}

//  BAD
class LoginPage {
  async login(username: string) {
    await this.page.locator('input[name="username"]').fill(username);
    // Hardcoded selector - if it changes, update everywhere
  }
}
```

**2. Descriptive Method Names**

```typescript
//  GOOD
async login(username: string, password: string)
async isErrorMessageVisible(): Promise<boolean>
async getCustomerName(): Promise<string>

//  BAD
async doLogin(u, p)  // Unclear parameters
async check(): Promise<boolean>  // Check what?
async get()  // Get what?
```

**3. Return Meaningful Values**

```typescript
//  GOOD - Returns boolean for verification
async isLoggedIn(): Promise<boolean> {
  return await this.isVisible(this.logoutButton);
}

// Test can easily verify
expect(await loginPage.isLoggedIn()).toBe(true);

//  BAD - Returns nothing, can't verify
async checkLoggedIn(): Promise<void> {
  await this.logoutButton.waitFor();
}
```

### Code Organization Best Practices

**1. One Class Per File**

```
 GOOD:
pages/LoginPage.ts       (LoginPage class)
pages/SearchPage.ts      (SearchPage class)

 BAD:
pages/AllPages.ts        (LoginPage + SearchPage + others)
```

**2. Logical File Grouping**

```
tests/
  ├── auth.spec.ts           # Authentication tests
  ├── search.spec.ts         # Search tests
  └── admin.spec.ts          # Admin tests

Not:
tests/
  ├── test1.spec.ts
  ├── test2.spec.ts
  └── misc.spec.ts
```

**3. Consistent Naming**

```
GOOD:
LoginPage.ts
RepairOrdersPage.ts
CustomersPage.ts

 BAD:
login.ts
repair_orders_page.ts
custPage.ts
```

### Security Best Practices

**1. Never Hardcode Credentials**

```typescript
//  BAD
await login("admin@company.com", "password123");

//  GOOD
await login(process.env.DMS_USER, process.env.DMS_PASS);
```

**2. Use .gitignore**

```
# .gitignore
.env              # Never commit credentials
*.log             # Don't commit logs
test-results/     # Don't commit test artifacts
```

**3. Separate Test and Production Data**

```
# .env (test environment)
BASE_URL=https://test.dms.example.com
DMS_USER=test.user@example.com

# Never use production credentials in tests!
```

---

## Conclusion

### What You've Built

This framework represents a **professional-grade QA automation solution** that demonstrates:

 **Modern Tools** - Playwright, TypeScript, GitHub Actions
 **Design Patterns** - Page Object Model, inheritance, separation of concerns
 **Best Practices** - AAA pattern, test independence, clean code
 **Comprehensive Testing** - UI tests, API tests, security tests
 **Production Ready** - CI/CD integration, error handling, reporting

### Skills Demonstrated

**Technical Skills:**
- Browser automation with Playwright
- TypeScript programming
- API testing
- CI/CD with GitHub Actions
- Version control with Git

**QA Engineering Skills:**
- Test case design (positive, negative, edge cases)
- Test data management
- Test framework architecture
- Reporting and debugging
- Security testing awareness

**Software Engineering Principles:**
- SOLID principles
- DRY (Don't Repeat Yourself)
- Clean code practices
- Documentation
- Code organization

### Next Steps for Learning

**1. Deepen Playwright Knowledge**
- Official docs: https://playwright.dev
- Try other browsers (Firefox, WebKit)
- Explore visual regression testing
- Learn about fixtures and custom test annotations

**2. Expand TypeScript Skills**
- Advanced types (generics, utility types)
- Decorators
- Async patterns

**3. Enhance Framework**
- Add more page objects
- Implement data-driven testing
- Add screenshot comparison
- Create custom reporters

**4. DevOps Integration**
- Try other CI/CD platforms (Jenkins, GitLab CI)
- Implement test parallelization
- Set up test environments
- Add performance testing

### Resources

**Official Documentation:**
- Playwright: https://playwright.dev
- TypeScript: https://www.typescriptlang.org
- GitHub Actions: https://docs.github.com/actions

**Learning Resources:**
- Playwright YouTube channel
- TypeScript handbook
- Testing best practices guides

**Community:**
- Playwright Discord
- Stack Overflow
- GitHub Discussions

---

## Appendix

### Quick Command Reference

```bash
# Installation
npm install
npx playwright install chromium

# Running Tests
npm test                              # Run all tests
npm run test:headed                   # With visible browser
npm run test:ui                       # Interactive mode
npx playwright test tests/auth.spec.ts # Specific file
npx playwright test --grep "login"    # By pattern
npx playwright test --debug           # Debug mode

# Viewing Results
npm run report                        # HTML report
npx playwright show-trace <trace-zip> # Trace viewer

# Development
npm run lint:types                    # Type check
npx playwright codegen <url>          # Generate test code
```

### Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `BASE_URL` | DMS web app base URL | `https://dms.example.com` |
| `DMS_USER` | Test user username/email | `test@example.com` |
| `DMS_PASS` | Test user password | `SecurePass123!` |
| `API_BASE_URL` | API endpoint base URL | `https://api.dms.com/v1` |
| `API_TOKEN` | API authentication token | `Bearer eyJhbG...` |

### TypeScript Configuration Options

```json
{
  "target": "ES2020",           // JavaScript version to compile to
  "module": "commonjs",         // Module system (Node.js compatible)
  "strict": true,               // Enable all strict type checking
  "esModuleInterop": true,      // Better module compatibility
  "skipLibCheck": true,         // Skip type checking of .d.ts files
  "noEmit": true,               // Don't output .js files (Playwright handles this)
  "baseUrl": ".",               // Base for path resolution
  "paths": {                    // Path aliases for cleaner imports
    "@pages/*": ["pages/*"],
    "@utils/*": ["utils/*"]
  }
}
```

### Playwright Configuration Options

```typescript
{
  testDir: "./tests",                    // Where tests are located
  timeout: 60_000,                       // Test timeout (60 seconds)
  expect: { timeout: 10_000 },           // Assertion timeout (10 seconds)
  use: {
    baseURL: process.env.BASE_URL,       // Base URL for navigation
    headless: true,                      // Run without visible browser
    trace: "on-first-retry",             // Capture trace on retry
    screenshot: "only-on-failure",       // Screenshot only on fail
    video: "retain-on-failure"           // Video only on fail
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } }
  ]
}
```

---

**Document Version:** 1.0
**Last Updated:** 2024
**Author:** QA Automation Engineer
**Framework:** Playwright + TypeScript

---

_This documentation is a living document. As the framework evolves, this guide should be updated to reflect new features, patterns, and best practices._
