---
name: CI Run Tests by Priority
description: Modify the workflow in playwright.yml to run tests by priority (High → Medium → Low), with parallel execution within each group, using tags and Playwright filters. Ensure fail‑fast for high‑priority tests.
---

Modify the workflow in `playwright.yml` to run tests by priority:

- First, run tests with **High priority** (`@high` tag) in parallel. Use Playwright’s `--grep` filter to select them. If any high‑priority test fails, the build must fail immediately (fail‑fast mode).
- Then, run tests with **Medium priority** (`@medium` tag) in parallel, also using `--grep`. These should start only after all high‑priority tests have completed successfully.
- Tests with **Low priority** can be run:
  - on a scheduled basis (e.g., nightly), or
  - manually triggered (via workflow dispatch).
  They are not required for every CI run.

Implementation requirements:

1. **Tagging tests**: In your Playwright test files, add metadata/tags:
   - Mark high‑priority tests with `@high` (e.g., in the test title or as a metadata comment).
   - Mark medium‑priority tests with `@medium`.
   - Low‑priority tests may be untagged or marked with `@low`.

2. **Playwright filter usage**: Use the `--grep` option in Playwright CLI to run tests matching a specific tag:
   - For high priority: `npx playwright test --grep "@high"`
   - For medium priority: `npx playwright test --grep "@medium"`

3. **Parallel execution**: Within each priority group, run tests in parallel. This is natively supported by Playwright; ensure your `playwright.config.ts` allows parallel workers (e.g., `workers: 4`).

4. **Workflow orchestration in GitHub Actions (`playwright.yml`)**:
   - Create separate jobs or steps for each priority level.
   - Chain them sequentially: High → Medium.
   - Set `fail-fast: true` for the high‑priority job.
   - Make the low‑priority run optional (triggered by schedule or manual dispatch).

5. **Fail‑fast for high priority**: The workflow must stop immediately if any test in the high‑priority group fails. Use GitHub Actions’ `continue-on-error: false` and ensure the job exits with a non‑zero code on failure.

Example snippet for `playwright.yml` (high‑priority job):

```yaml
jobs:
  run-high-priority-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run high-priority tests (fail-fast)
        run: npx playwright test --grep "@high"
        # GitHub Actions will fail the job if this command exits with non-zero
```
