---
name: Code Risk Analysis
description: For code risk analysis. Review code and store result in a file.
---

Analyze the project code and identify potential risks and dangerous issues. Focus on:

- security vulnerabilities (SQL injection, XSS, CSRF, insecure deserialization);
- potential memory or resource leaks;
- unused or commented‑out code;
- “magic” numbers and strings without constants;
- complex and long functions (over 50 lines);
- code duplication;
- exception handling errors (empty catch blocks, ignored errors);
- hardcoded URLs, passwords, API keys;
- outdated dependencies (check package.json / pom.xml / requirements.txt).

Present the result as a Markdown table with columns: “File”, “Line”, “Risk”, “Description”, “Severity Level” (High/Medium/Low). At the end, provide a brief summary report on the number of risks by severity level.