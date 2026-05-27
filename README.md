# AI Training Project

[![Playwright Tests](https://github.com/grechko-an/ai-training-project/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/grechko-an/ai-training-project/actions/workflows/playwright-tests.yml)
[![Smoke Tests](https://github.com/grechko-an/ai-training-project/actions/workflows/smoke-tests.yml/badge.svg)](https://github.com/grechko-an/ai-training-project/actions/workflows/smoke-tests.yml)
[![Regression Tests](https://github.com/grechko-an/ai-training-project/actions/workflows/regression-tests.yml/badge.svg)](https://github.com/grechko-an/ai-training-project/actions/workflows/regression-tests.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

A comprehensive QA automation infrastructure built with **Playwright** and **TypeScript**, following the **Page Object Model (POM)** design pattern. This project provides a robust foundation for end-to-end (E2E), API, and data-driven testing with multi-browser support, CI/CD integration, and rich reporting capabilities.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Writing Tests](#writing-tests)
  - [E2E Tests (Page Object Model)](#e2e-tests-page-object-model)
  - [API Tests](#api-tests)
  - [Data-Driven Tests](#data-driven-tests)
- [Running Tests](#running-tests)
- [Test Tagging & Priority System](#test-tagging--priority-system)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
  - [GitHub Actions](#github-actions)
  - [Jenkins Pipeline](#jenkins-pipeline)
- [Custom Fixtures](#custom-fixtures)
- [Utility Functions](#utility-functions)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi-browser testing** — Chromium, Firefox, WebKit (desktop + mobile)
- **Page Object Model (POM)** — Maintainable and reusable page abstractions
- **API testing** — Dedicated API client classes with Axios and Playwright request contexts
- **Data-driven testing** — Parameterized tests with `TestDataGenerator`
- **Priority-based test tagging** — P0 (smoke), P1, P2, P3 for risk-based execution
- **Comprehensive reporting** — HTML, JUnit, Allure, JSON reporters
- **CI/CD ready** — GitHub Actions workflows and Jenkins declarative pipeline
- **Parallel execution** — Cross-browser parallel test runs
- **Environment configuration** — Multi-environment support (local, dev, staging, prod)
- **Global setup/teardown** — Automated test data preparation and cleanup
- **Rich test artifacts** — Screenshots, videos, and traces captured on failure
- **Slack notifications** — Real-time alerts for test failures

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) ^1.60.0 | Test runner and browser automation |
| [TypeScript](https://www.typescriptlang.org/) ^6.0.3 | Type-safe test code |
| [Axios](https://axios-http.com/) ^1.16.1 | HTTP client for API testing |
| [Allure Playwright](https://www.npmjs.com/package/allure-playwright) ^3.9.0 | Allure reporting integration |
| [dotenv](https://www.npmjs.com/package/dotenv) ^17.4.2 | Environment variable management |
| [Joi](https://joi.dev/) ^18.2.1 | Schema validation (optional) |
| [Node.js](https://nodejs.org/) >= 18.0.0 | Runtime |

---

## Project Structure

```
ai-training-project/
├── .github/
│   └── workflows/
│       ├── playwright-tests.yml       # Full CI pipeline
│       ├── smoke-tests.yml            # Quick smoke tests on every commit
│       └── regression-tests.yml       # Nightly regression suite
├── tests/
│   ├── api/
│   │   ├── clients/
│   │   │   ├── BaseApiClient.ts       # Base HTTP client with Axios
│   │   │   └── AuthApiClient.ts       # Auth-specific API client
│   │   └── specs/
│   │       └── auth.spec.ts           # Auth API test suite
│   ├── config/
│   │   ├── environment.ts             # Environment config loader
│   │   ├── globalSetup.ts             # Global test setup hook
│   │   └── globalTeardown.ts          # Global test teardown hook
│   ├── e2e/
│   │   ├── pages/
│   │   │   ├── BasePage.ts            # Abstract base page object
│   │   │   └── LoginPage.ts           # Login page object
│   │   └── specs/
│   │       └── login.spec.ts          # Login E2E test suite
│   ├── fixtures/
│   │   └── index.ts                   # Custom Playwright fixtures
│   ├── types/
│   │   └── index.ts                   # Shared TypeScript interfaces
│   └── utils/
│       ├── assertions.ts              # Custom assertion utilities
│       ├── helpers.ts                 # General helper functions
│       ├── index.ts                   # Barrel export
│       └── testDataGenerator.ts       # Test data generation
├── .env.example                       # Environment template
├── .env.ci                            # CI-specific environment
├── Jenkinsfile                        # Jenkins declarative pipeline
├── package.json                       # Dependencies and scripts
├── playwright.config.ts               # Playwright configuration
└── tsconfig.json                      # TypeScript configuration
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm (comes with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/grechko-an/ai-training-project.git
cd ai-training-project
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit [`.env`](.env.example) with your target application URLs and credentials.

### 5. Run the tests

```bash
# Run all tests
npm test

# Run only smoke tests (P0)
npm run test:smoke

# Run E2E tests
npm run test:e2e

# Run API tests
npm run test:api
```

---

## Configuration

### Environment Files

The project supports multiple environments via `.env` files:

| File | Purpose |
|---|---|
| [`.env`](.env.example) | Local development (default) |
| `.env.dev` | Development environment |
| `.env.staging` | Staging environment |
| `.env.prod` | Production environment |
| [`.env.ci`](.env.ci) | CI/CD pipeline environment |

Switch environments by setting the `ENV` variable:

```bash
ENV=staging npm test
```

### Playwright Configuration

The main configuration is in [`playwright.config.ts`](playwright.config.ts) and includes:

- **Test directory**: `./tests`
- **Fully parallel** execution by default
- **CI mode**: 2 retries, 50% workers; local: 0 retries, 1 worker
- **Timeouts**: 60s test timeout, 10s expect timeout, 15s action timeout
- **Reporters**: HTML, JUnit, Allure, JSON, and list (console)
- **Projects**: Chromium, Firefox, WebKit (desktop) + Pixel 5, iPhone 13 (mobile)
- **Artifacts**: Screenshots and videos on failure, trace on first retry

### TypeScript Configuration

[`tsconfig.json`](tsconfig.json) provides path aliases for clean imports:

```typescript
import { LoginPage } from '@pages/e2e/pages/LoginPage';
import { BaseApiClient } from '@api/clients/BaseApiClient';
import { TestDataGenerator } from '@utils/testDataGenerator';
```

---

## Writing Tests

### E2E Tests (Page Object Model)

Each page in the application has a corresponding page class that encapsulates element locators and interaction methods.

#### Creating a Page Object

Extend [`BasePage`](tests/e2e/pages/BasePage.ts) which provides common methods like `click()`, `fillInput()`, `waitForElementVisible()`, and assertion helpers.

```typescript
// tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /log in/i });
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }
}
```

#### Writing an E2E Test

```typescript
// tests/e2e/specs/login.spec.ts
import { test, expect } from '../../fixtures';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Functionality', () => {
  test('should successfully login with valid credentials @P0 @smoke @e2e', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser', 'testpass');
    await expect(page).not.toHaveURL(/\/login/);
  });
});
```

### API Tests

API tests use dedicated client classes that extend [`BaseApiClient`](tests/api/clients/BaseApiClient.ts).

#### Creating an API Client

```typescript
// tests/api/clients/AuthApiClient.ts
import { BaseApiClient } from './BaseApiClient';
import { ApiResponse, AuthTokenResponse } from '../../types';

export class AuthApiClient extends BaseApiClient {
  async login(username: string, password: string): Promise<ApiResponse<AuthTokenResponse>> {
    const response = await this.post<AuthTokenResponse>('/auth/login', { username, password });
    if (response.status === 200 && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }
}
```

#### Writing an API Test

```typescript
// tests/api/specs/auth.spec.ts
import { test } from '../../fixtures';
import { AuthApiClient } from '../clients/AuthApiClient';
import { assertApiSuccess, assertApiResponseHasProperties } from '../../utils/assertions';

test.describe('Authentication API', () => {
  test('should login successfully @P0 @smoke @api', async ({ config }) => {
    const authClient = new AuthApiClient(config.apiBaseUrl, config.apiVersion, config.apiTimeout);
    const response = await authClient.login('testuser', 'testpass');
    assertApiSuccess(response);
    assertApiResponseHasProperties(response, ['token', 'expiresIn', 'tokenType']);
  });
});
```

### Data-Driven Tests

Use [`TestDataGenerator`](tests/utils/testDataGenerator.ts) to create parameterized test cases:

```typescript
import { test } from '../../fixtures';
import { TestDataGenerator } from '../../utils/testDataGenerator';

const loginTestData = TestDataGenerator.generateLoginTestData();

loginTestData.forEach(({ username, password, expectedSuccess, expectedErrorMessage }) => {
  test(`login with username="${username}" @P2 @regression`, async () => {
    // test logic
  });
});
```

---

## Running Tests

### Available Scripts

| Script | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:e2e` | Run E2E tests (`@e2e`) |
| `npm run test:api` | Run API tests (`@api`) |
| `npm run test:smoke` | Run smoke tests (`@P0`) |
| `npm run test:regression` | Run regression tests (`@regression`) |
| `npm run test:ui` | Run UI tests (`@ui`) |
| `npm run test:headless` | Run tests in headless mode |
| `npm run test:chrome` | Run tests on Chromium only |
| `npm run test:firefox` | Run tests on Firefox only |
| `npm run test:webkit` | Run tests on WebKit only |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:report` | Run tests with HTML + Allure reporters |
| `npm run test:parallel` | Run tests with 4 parallel workers |
| `npm run allure:generate` | Generate Allure report |
| `npm run allure:open` | Open Allure report |
| `npm run allure:serve` | Serve Allure report |
| `npm run playwright:install` | Install Playwright browsers |
| `npm run build` | TypeScript compilation check |
| `npm run lint` | Run ESLint |

### Examples

```bash
# Run smoke tests on Chromium
npm run test:smoke -- --project=chromium

# Run a specific test file
npx playwright test tests/e2e/specs/login.spec.ts

# Run tests with a specific tag combination
npx playwright test --grep "@P0 @smoke"

# Run tests in headed mode for debugging
npm run test:headless -- --headed
```

---

## Test Tagging & Priority System

Tests are tagged with priority levels and test types for flexible execution:

| Tag | Priority | Description | Execution |
|---|---|---|---|
| `@P0` | Critical | Core functionality (login, checkout) | Every commit (smoke) |
| `@P1` | Major | Important features | Daily regression |
| `@P2` | Minor | Edge cases, variations | Full regression |
| `@P3` | Nice-to-have | Low-risk scenarios | Full regression |
| `@smoke` | — | Smoke test suite | Every commit |
| `@regression` | — | Regression suite | Nightly |
| `@e2e` | — | End-to-end tests | As needed |
| `@api` | — | API tests | As needed |
| `@ui` | — | UI-specific tests | As needed |
| `@mobile` | — | Mobile-specific tests | Mobile projects only |

---

## Reporting

The project generates multiple report formats for different use cases:

### HTML Report (Playwright)

```bash
npx playwright show-report
```

### Allure Report

```bash
npm run allure:generate
npm run allure:open
```

### JUnit Report

Located at `tests/reports/junit/junit.xml` — compatible with Jenkins and other CI tools.

### JSON Report

Located at `tests/reports/json/test-results.json` — suitable for custom processing.

### Report Output Structure

```
tests/reports/
├── allure-results/       # Raw Allure data
├── allure-report/        # Generated Allure HTML report
├── html/                 # Playwright HTML report
├── junit/                # JUnit XML report
└── json/                 # JSON test results
```

---

## CI/CD Integration

### GitHub Actions

Three workflows are provided in [`.github/workflows/`](.github/workflows/):

| Workflow | Trigger | Scope |
|---|---|---|
| [`playwright-tests.yml`](.github/workflows/playwright-tests.yml) | Push/PR to `main`/`develop` | Full suite across Chromium, Firefox, WebKit |
| [`smoke-tests.yml`](.github/workflows/smoke-tests.yml) | Every commit (non-main) | P0 tests on Chromium only (fast feedback) |
| [`regression-tests.yml`](.github/workflows/regression-tests.yml) | Nightly schedule + manual | Full regression across all browsers |

All workflows include:
- TypeScript type checking
- Parallel browser execution via matrix strategy
- Artifact uploads (HTML, JUnit, Allure, JSON reports)
- Screenshots, videos, and traces on failure
- Slack notifications on failure (configurable)

### Jenkins Pipeline

A declarative pipeline is defined in [`Jenkinsfile`](Jenkinsfile) with:

- **Parameters**: `TEST_ENV`, `TEST_SUITE`, `PARALLEL_EXECUTION`, `BROWSERS`
- **Stages**: Checkout → Install → Build (TypeScript) → Test (parallel) → Reports
- **Post-build**: JUnit publishing, HTML report, Allure report, workspace cleanup
- **Notifications**: Slack integration (commented out, ready to enable)

---

## Custom Fixtures

Custom Playwright fixtures are defined in [`tests/fixtures/index.ts`](tests/fixtures/index.ts):

| Fixture | Description |
|---|---|
| `config` | Loaded `EnvironmentConfig` with all env variables |
| `apiClient` | Pre-configured `BaseApiClient` instance |
| `authenticatedPage` | Browser page with simulated authentication |
| `authenticatedApiClient` | API client with auth token set |
| `testData` | Unique test identifiers (`uniqueId`, `timestamp`) |

Usage in tests:

```typescript
import { test, expect } from '../../fixtures';

test('example', async ({ config, apiClient, testData }) => {
  console.log(config.baseUrl);       // http://localhost:3000
  console.log(testData.uniqueId);    // test-1234567890-abc123
  await apiClient.get('/users');
});
```

---

## Utility Functions

### Assertions ([`tests/utils/assertions.ts`](tests/utils/assertions.ts))

| Function | Description |
|---|---|
| `assertApiSuccess()` | Assert 2xx status code |
| `assertApiStatus()` | Assert specific status code |
| `assertApiResponseHasProperties()` | Assert response contains expected properties |
| `assertApiResponseStructure()` | Assert response data types match expected shape |
| `assertApiError()` | Assert error response structure |
| `assertPaginatedResponse()` | Assert valid pagination response |
| `assertValidEmail()` | Assert valid email format |
| `assertValidUUID()` | Assert valid UUID format |
| `assertValidISODate()` | Assert valid ISO date string |
| `assertNumberInRange()` | Assert number within range |
| `assertNotEmpty()` | Assert string is not empty |
| `assertArrayNotEmpty()` | Assert array is not empty |
| `assertArrayLength()` | Assert array has specific length |
| `assertResponseTime()` | Assert response time within limit |
| `assertPlaywrightResponseOk()` | Assert Playwright APIResponse is OK |

### Helpers ([`tests/utils/helpers.ts`](tests/utils/helpers.ts))

| Function | Description |
|---|---|
| `generateRandomString()` | Random alphanumeric string |
| `generateRandomEmail()` | Random email address |
| `generateRandomPhoneNumber()` | Random US phone number |
| `generateRandomNumber()` | Random integer in range |
| `generateUUID()` | UUID v4 string |
| `generateTestUser()` | Random user object |
| `generateTestProduct()` | Random product object |
| `waitForNetworkResponse()` | Wait for specific network request |
| `blockNetworkRequests()` | Block requests matching patterns |
| `mockNetworkResponse()` | Mock API response |
| `sleep()` | Fixed delay (use sparingly) |
| `measureExecutionTime()` | Measure async function duration |
| `isCI()` | Check if running in CI |
| `getTestEnvironment()` | Get current environment name |
| `pickRandom()` | Pick random array item |

### Test Data Generator ([`tests/utils/testDataGenerator.ts`](tests/utils/testDataGenerator.ts))

| Method | Description |
|---|---|
| `TestDataGenerator.generateUser()` | Complete user profile with address |
| `TestDataGenerator.generateAddress()` | Address data |
| `TestDataGenerator.generateLoginTestData()` | Array of login scenarios (valid/invalid) |
| `TestDataGenerator.generateProduct()` | Product data |
| `TestDataGenerator.generateOrder()` | Order with products and shipping |
| `TestDataGenerator.generateInvalidData()` | Edge case values for negative testing |
| `TestDataGenerator.generateFormValidationData()` | Form validation scenarios |
| `TestDataGenerator.generateApiTestData()` | CRUD API test scenarios |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the **Page Object Model** pattern for all E2E tests
- Tag tests with appropriate **priority (P0-P3)** and **type (smoke, regression, etc.)**
- Keep tests **independent and atomic** — no shared state between tests
- Use **explicit waits** (`waitForSelector`, `toBeVisible`) over fixed delays
- Write **descriptive test names** following the pattern: `should [expected behavior] when [condition]`
- Include **Arrange/Act/Assert** comments in test bodies
- Use the **`TestDataGenerator`** for test data instead of hardcoded values

---

## License

Distributed under the Apache License 2.0. See [`LICENSE`](LICENSE) for more information.