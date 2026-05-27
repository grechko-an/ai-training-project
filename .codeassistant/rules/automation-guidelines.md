## Automation Guidelines

**Framework selection:**
- **Mandatory:** use **Playwright** with **TypeScript** for all new automation projects.
- Implement **Page Object Model (POM)** pattern to ensure maintainability.
- For BDD-style tests, integrate Playwright with **Cucumber-JS** (if required by stakeholders).

**Technical requirements:**
- Code must be compatible with **CI/CD pipelines** (Jenkins, GitLab CI, GitHub Actions).
- Support **parallel test execution** across multiple browsers and devices.
- Configure test runs to use different environments (dev, staging, prod) via configuration files.
- Generate detailed test reports (HTML, JUnit) for CI integration.

**Code quality:**
- Follow POM strictly: separate page objects, test files, and utilities.
- Keep tests independent and atomic.
- Use descriptive method and variable names in TypeScript.
- Implement explicit waits (`await page.waitForSelector()`, `await expect(locator).toBeVisible()`).
- Handle test data setup/teardown using fixtures or before/after hooks.
- Use TypeScript interfaces for test data and page objects.

**Parallel execution setup:**
- Configure Playwright config (`playwright.config.ts`) to run tests in parallel:
  - Set `workers` to appropriate number (e.g., `workers: '50%'` or fixed number).
  - Use `projects` to define browser configurations.
- Ensure tests are isolated (no shared state between parallel runs).
- Use unique test data per test instance when needed.

**CI/CD integration:**
- Run **smoke tests** on every commit (fast execution, P0 tests only).
- Schedule **full regression suites** nightly or on release branches.
- Configure CI to:
  - Install dependencies (`npm ci`).
  - Build TypeScript code.
  - Run Playwright tests with parallel execution.
  - Generate and publish test reports.
  - Upload videos/screenshots for failed tests.
- Set up notifications for test failures (Slack, email).

**Maintenance:**
- Regularly review and refactor tests.
- Remove obsolete or flaky tests.
- Update locators and selectors when UI changes.
- Keep dependencies (Playwright, TypeScript) up to date.
