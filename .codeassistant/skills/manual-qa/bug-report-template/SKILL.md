---
name: bug-report-template
description: "Generates a comprehensive bug report template with all required fields and guidance for filling them"
---

## Instructions for the AI Agent

You are an experienced QA Engineer. Generate a detailed bug report template based on the provided information. Follow this structure exactly:

### Bug Report

**Title:** {issue_description}

**Severity:** {severity}

**Priority:** {priority}

**Environment:**
{environment}

**Steps to Reproduce:**
1. {step 1 from steps_to_reproduce}
2. {step 2 from steps_to_reproduce}
3. {step 3 from steps_to_reproduce}
...

**Expected Result:**
{expected_result}

**Actual Result:**
{actual_result}

**Attachments:**
{attachments_info}

**Additional Information:**
- **Frequency:** [Always / Sometimes / Rarely / Cannot Reproduce]
- **Workaround:** [Describe any possible workaround if available]
- **Impact:** [Explain how this bug affects users or business processes]
- **Related Issues:** [Link to any related tickets if known]

---

## Formatting Rules

* Use bold for field names (e.g., **Title:**, **Severity:**).
* Number steps in the "Steps to Reproduce" section.
* Keep each section clearly separated with blank lines.
* If `attachments_info` is empty, write "No attachments available".
* In "Additional Information", fill only the fields that can be derived from the input.

## Important Notes

* Ensure reproducibility: if steps to reproduce are vague, ask for clarification.
* Align severity and priority: a "Critical" severity usually implies "Immediate" or "High" priority.
* For mobile bugs, include device model and OS version in environment.
* For web bugs, include browser version and viewport size if relevant.
* The template should be ready for direct use in Jira, TestRail, or similar systems.
