---
name: Setup GitHub CI Pipeline
description: Create a GitHub Actions workflow to run automated tests. File: .github/workflows/playwright.yml.
---

Create a GitHub Actions workflow to run automated tests. The workflow file should be placed at `.github/workflows/playwright.yml` and must meet the following requirements:

1. Trigger the workflow on Pull Request creation targeting the `main` branch.
2. Use the latest LTS version of Node.js as the runtime environment.
3. Install project dependencies using the `npm ci` command.
4. Install required browsers for Playwright by running `npx playwright install`.
5. Execute tests via `npx playwright test`, enabling parallel execution with the `--workers=4` flag.
6. Publish the Allure report as a workflow artifact, making it available for download after the job completes.

Workflow implementation details:
- Use appropriate GitHub Actions syntax to define jobs and steps.
- Ensure the Node.js setup step explicitly specifies the LTS version (e.g., `lts/*` or a specific LTS release).
- Include necessary steps for setting up the environment, installing dependencies, and preparing Playwright.
- Configure artifact publishing using the `actions/upload-artifact@v4` action, targeting the Allure report output directory (typically `allure-results` or `allure-report`, depending on configuration).

After setting up the workflow:

1. Commit all related changes (including test code, page objects, and the workflow file) to a new Git branch.
2. Push the new branch to the remote repository.
3. Create a Pull Request from this branch to the `main` branch. In the Pull Request description, include the following text:  
   > “Automated E2E and API tests using Playwright”

Verify that the workflow runs successfully on the Pull Request and that the Allure report artifact is correctly published.
