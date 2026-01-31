# DMS QA Automation Framework

A professional test automation framework for Document Management System (DMS) applications, built with Playwright and TypeScript. This project demonstrates modern QA automation practices including UI testing, API testing, and CI/CD integration.

## Overview

This framework provides comprehensive test coverage for a DMS web application, featuring:

- 69 automated tests across 4 test suites
- Page Object Model (POM) design pattern
- TypeScript for type-safe, maintainable code
- API and UI test integration
- GitHub Actions CI/CD pipeline
- Detailed HTML reports with screenshots and traces

## Technologies

- **Playwright** v1.48.0 - Modern browser automation framework
- **TypeScript** v5.6.2 - Type-safe JavaScript
- **Node.js** v18+ - JavaScript runtime
- **GitHub Actions** - CI/CD automation

## Quick Start

### Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dms-qa-automation-poc

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
BASE_URL=https://your-dms-url.com
DMS_USER=your-username@example.com
DMS_PASS=your-password
API_BASE_URL=https://api.your-dms-url.com/v1
API_TOKEN=your-api-token
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/auth.spec.ts

# View HTML report
npm run report
```

## Project Structure

```
dms-qa-automation-poc/
├── .github/workflows/    # GitHub Actions CI/CD
├── pages/                # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── RepairOrdersPage.ts
│   └── AppointmentsPage.ts
├── tests/                # Test suites
│   ├── auth.spec.ts
│   ├── repairOrders.spec.ts
│   ├── appointments.spec.ts
│   └── api.spec.ts
├── utils/                # Utilities and test data
│   ├── env.ts
│   ├── testData.ts
│   └── apiClient.ts
└── playwright.config.ts  # Playwright configuration
```

## Test Suites

- **Authentication** (15 tests) - Login/logout, form validation, security testing
- **Repair Orders** (18 tests) - CRUD operations, search, filtering
- **Appointments** (15 tests) - Scheduling, calendar interactions, cancellations
- **API** (21 tests) - REST API validation, performance checks

## CI/CD Integration

This project includes a GitHub Actions workflow that:

- Runs on every push and pull request
- Executes all tests in headless mode
- Generates HTML reports
- Uploads test artifacts

Configure repository secrets in GitHub for CI/CD:
- `BASE_URL`
- `DMS_USER`
- `DMS_PASS`
- `API_BASE_URL`
- `API_TOKEN`

## Documentation

For comprehensive documentation including architecture details, best practices, and troubleshooting guides, see [DOCUMENTATION.md](DOCUMENTATION.md).

## Key Features

- **Page Object Model** - Maintainable, reusable test code
- **Type Safety** - Full TypeScript implementation
- **Comprehensive Testing** - UI, API, and security tests
- **Parallel Execution** - Fast test execution
- **Rich Reporting** - HTML reports with screenshots and video
- **CI/CD Ready** - GitHub Actions integration

## Development

```bash
# Check TypeScript compilation
npm run lint:types

# Debug specific test
npx playwright test tests/auth.spec.ts --debug

# Run tests matching pattern
npx playwright test --grep "login"
```

## License

This project is private and for demonstration purposes.
