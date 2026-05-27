---
name: Generate autotests
description: Based on the test case files, generate automated tests using Playwright with TypeScript and the Page Object Model (POM) pattern.
---

Based on the test case files, generate automated tests using Playwright with TypeScript and the Page Object Model (POM) pattern.

Create the following folder structure:

tests/
e2e/
api/
pages/
e2e/
api/


For each test case:

- create a separate test file in the appropriate `tests/` folder;
- describe page objects in the corresponding `pages/` files;
- use `async/await`;
- add comments to complex code sections;
- ensure error handling and logging.

Use `test.describe` and `test.it` for test grouping. Import pages from the `pages` folder.
