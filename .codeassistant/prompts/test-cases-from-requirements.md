---
name: Test Cases from Requirements
description: Generate a set of test cases based on the functional requirements for the project (provided in the requirements.md file). Create test_cases_requirements.md with 2–4 test cases (positive and negative scenarios) per requirement, using the specified format and linking to requirement IDs.
---

Name: Test Cases from Requirements

Prompt:
Generate a set of test cases based on the functional requirements for the project (provided in the requirements.md file).

Create a separate file `test_cases_requirements.md`. For each requirement, create 2–4 test cases (positive and negative scenarios). Use the following format:

| ID | Title | Precondition | Steps | Expected Result | Requirement |
|----|-------|--------------|-------|---------------|-------------|

In the **Requirement** column, add a link to the corresponding requirement ID (e.g., `[REQ-001](requirements.md#req-001)`).

Guidelines:
1. Ensure all requirements are covered by test cases.
2. For each requirement, include:
   - At least one positive test case (valid input/expected behaviour).
   - At least one negative test case (invalid input/error handling).
   - Optionally, edge‑case scenarios if applicable.
3. If any requirement is ambiguous or lacks sufficient detail to create a test case:
   - Create a placeholder test case.
   - In the **Expected Result** column, write: `COMMENT: Requirement [REQ‑ID] is ambiguous. Clarification needed regarding <specific point>`.
4. Use clear, actionable language in **Steps** (e.g., “Click the ‘Submit’ button”, “Enter an invalid email format”).
5. Make **Expected Result** verifiable (e.g., “Error message ‘Invalid email’ is displayed”, “User is redirected to the dashboard”).
