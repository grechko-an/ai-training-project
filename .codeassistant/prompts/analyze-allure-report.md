---
name: Analyze Allure Report
description: After the test run in CI, analyze the Allure Report artifact to identify failed, flaky, and slow tests, as well as coverage by components/modules, and compose a brief Markdown report with key findings and recommendations.
---

**Prompt:**

After the test run in CI, analyze the Allure Report artifact.

**Identify:**

- failed tests (Failed);
- flaky tests (Flaky);
- slowest tests (Slow);
- coverage by components/modules.

**Compose a brief Markdown report with:**

- overall build status (success/failure);
- list of failed tests and brief error description;
- suggestions for stabilizing flaky tests;
- recommendations for optimizing slow tests.
