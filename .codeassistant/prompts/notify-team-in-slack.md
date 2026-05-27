---
name: Notify Team in Slack
description: Set up automatic notifications in the Slack channel #qa-reports about the results of the automated test run in CI.
---

Set up automatic notifications in the Slack channel `#qa-reports` about the results of the automated test run in CI.

The Slack message must contain:

- build status (🟢 Success / 🔴 Failure / 🟡 Partially successful);
- link to the Allure Report (artifact URL);
- link to the GitHub Actions job (run URL);
- test summary:
  - total number of test cases;
  - number of passed (✅);
  - number of failed (❌);
  - number of flaky (⚠️);
  - coverage percentage;
- list of failed tests with a brief error description (first 5–10 lines);
- name of the test automation maintainer (@username);
- run time and duration.

Use the Slack API and GitHub Actions for integration. In the workflow, add a step after the test run that sends a POST request to the Slack webhook. Format the message using Slack Markdown for better readability. If the build fails…
