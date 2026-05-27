---
name: allure
description: "Generates and manages Allure reports for manual QA testing activities in SourceCraft. Helps to structure test results, attach evidence (screenshots, logs), and produce readable reports."
---

# Allure Report Skill for Manual QA in SourceCraft

This skill helps manual QA engineers work with Allure reports directly in SourceCraft's Code Assistant. It automates report generation, attachment of manual test evidence, and report sharing.

## Usage

Run the skill with `/allure-report-manual-qa` and provide required parameters.

### Example commands:

- `/allure-report-manual-qa test_results_dir:target/allure-results report_output_dir:allure-report`
- `/allure-report-manual-qa test_results_dir:target/allure-results environment:staging`
- `/allure-report-manual-qa test_results_dir:target/allure-results attach_screenshots:false`


## Instructions for the AI Assistant

1. **Validate input parameters**:
   - Check that `test_results_dir` exists and contains Allure-compatible data.
   - If `report_output_dir` is not specified, use the default value.
   - Validate `environment` against allowed options.

2. **Prepare Allure results directory**:
   - Ensure the directory `{{test_results_dir}}` is accessible.
   - If manual test data is not in Allure XML format, help convert it using Allure CLI or suggest a template.

3. **Attach manual test evidence**:
   - If `attach_screenshots` is `true`, look for image files (PNG, JPG) in the results directory or subdirectories named `screenshots/`.
   - Use Allure CLI command to attach files:
     ```bash
     allure add-attachment --source <file> --type image/png --name "Screenshot" --testcase <testcase_id>
     ```
   - For logs or notes, attach as text files with appropriate MIME types.

4. **Generate the Allure report**:
   - Run Allure generation command:
     ```bash
     allure generate {{test_results_dir}} --output {{report_output_dir}} {{ '--clean' if generate_html else '' }}
     ```
   - The `--clean` flag ensures a fresh report is generated.

5. **Add environment and metadata**:
   - Create or update `allure.properties` in the results directory:
     ```properties
     allure.environment=\{{environment}}
     allure.manual.testing=true
     ```

6. **Verify and summarize the report**:
   - Confirm the HTML report was generated in `{{report_output_dir}}/index.html`.
   - Provide a summary of test results:
     - Total tests
     - Passed/failed/skipped
     - Link to the generated report

7. **Provide next steps**:
   - Suggest how to share the report (e.g., upload to a shared drive, send link).
   - Recommend actions for failed tests.

## Expected Output

The skill returns:
- A confirmation message with the path to the generated report.
- A brief summary of the test results.
- Links or instructions for accessing the HTML report.
- Any warnings or errors encountered during processing.

## Common Issues and Fixes

| Issue | Solution |
|-------|---------|
| Allure not found | Ensure Allure CLI is installed and available in PATH |
| Empty results directory | Check that manual test data was exported correctly to Allure format |
| Missing attachments | Verify screenshot files exist and paths are correct |
| HTML report not generated | Check write permissions in output directory |

## Prerequisites

- Allure CLI must be installed and accessible.
- Manual test results should be in Allure XML format or prepared for conversion.
- Sufficient disk space and write permissions for output directories.

---
**Note**: This skill assumes basic familiarity with Allure reporting and manual testing workflows. For complex scenarios, consult the Allure documentation or your QA lead.
