---
name: code-analysis
description: "Performs a comprehensive code analysis for ReactJS + NodeJS projects, identifying issues with code quality, structure, security, performance, and best practices. Provides structured feedback and actionable recommendations for both frontend and backend components."
---

# ReactJS + NodeJS Code Analysis Skill

## Purpose
This skill helps perform structured manual QA analysis of full‑stack ReactJS (frontend) + NodeJS (backend) projects. It evaluates code against framework‑specific criteria, identifies potential issues, and provides actionable feedback to improve code quality, security, and maintainability.

## Analysis Criteria

### 1. Project Structure and Setup
- Verify logical project organization (e.g., `src/`, `components/`, `hooks/`, `services/` for React; `routes/`, `controllers/`, `models/` for NodeJS).
- Check `package.json` files (frontend and backend) for dependency versions and scripts.
- Run `npm audit` to detect known vulnerabilities.
- Review configuration files (`package.json`, `.env`, `webpack.config.js`, `vite.config.js`, etc.).
- Confirm presence and quality of documentation (`README.md`, API docs).

### 2. Frontend (ReactJS)
- **Component Structure:** assess reusability, separation of concerns, use of custom Hooks.
- **State Management:** evaluate use of `useState`, `useReducer`, or external libraries (Redux, Zustand).
- **Routing:** verify React Router setup, path definitions, 404 handling.
- **API Interactions:** review centralized API services, loading/success/error states.
- **Styling:** identify approach (CSS Modules, styled‑components, Tailwind CSS), check consistency.
- **Performance:** look for unnecessary re‑renders, consider code splitting and lazy loading.
- **Accessibility (a11y):** check semantic HTML, `alt` attributes, keyboard navigation, ARIA attributes.

### 3. Backend (NodeJS)
- **API Endpoints:** review route definitions, HTTP methods, RESTful naming.
- **Business Logic:** assess separation of concerns (controllers, services, models).
- **Data Validation:** verify input validation (Joi, Yup, custom validators), prevent injection attacks.
- **Error Handling:** check centralized middleware, HTTP status codes, avoid exposing sensitive details.
- **Database Interactions:** review connection setup, ORMs (Sequelize, Mongoose), query efficiency.
- **Security:** verify environment variables for secrets, authentication/authorization (JWT, OAuth), protection against CSRF/XSS/rate limiting.

### 4. Integration and Data Flow
- **API Contract:** compare frontend API calls with backend endpoints, ensure JSON structure consistency.
- **Error Propagation:** test how backend errors are handled and displayed on frontend.
- **CORS:** verify backend CORS configuration for frontend origin.

### 5. Code Quality and Best Practices
- **Linting and Formatting:** check ESLint/Prettier configs, run linters.
- **Testing:** review unit/integration tests (Jest, Mocha, Chai), assess coverage.
- **Logging:** look for structured logging (winston, pino).
- **Environment Management:** confirm `.env` files for dev/prod environments.
- **TypeScript (if used):** verify type safety, proper annotations, null/undefined handling.

### 6. Performance Optimization
- **Frontend:** identify re‑render bottlenecks, lazy loading opportunities.
- **Backend:** check query efficiency, connection pooling, caching strategies.
- **Network:** optimize payload sizes, use compression where applicable.

### 7. Security Best Practices
- Input sanitization and validation.
- Secure session management.
- Rate limiting and abuse prevention.
- HTTPS enforcement.
- Dependency vulnerability monitoring.

---

## Output Format

Provide feedback in the following structured format:

```markdown
### ReactJS + NodeJS Code Analysis Report for {{project_name}}

**Date:** [YYYY‑MM‑DD]
**Overall Assessment:** [Brief summary of code quality, major strengths, and critical issues]

#### Issues Found:

1. **[Category]:** [Description of issue]
   - **Location:** [File path, line numbers, or component/endpoint name]
   - **Severity:** [Critical/High/Medium/Low]
   - **Impact:** [How this affects the project (security risk, performance degradation, etc.)]
   - **Recommendation:** [Actionable fix with framework‑specific solution]
   - **Example:** [Code snippet showing problem and corrected version]

2. **[Category]:** [Description of issue]
   - **Location:** [File path, line numbers, or component/endpoint name]
   - **Severity:** [Critical/High/Medium/Low]
   - **Impact:** [How this affects the project]
   - **Recommendation:** [Actionable fix]
   - **Example:** [Code snippet]

...

#### Positive Aspects:
- [Well‑structured components or modules]
- [Effective use of state management patterns]
- [Secure authentication implementation]
- [Comprehensive test coverage]
- [Clear API documentation]
- [Other strengths observed]

#### Suggestions for Improvement:
- [General refactoring opportunities]
- [Performance optimization ideas]
- [Security hardening measures]
- [Testing strategy enhancements]
- [Documentation improvements]

#### Next Steps:
1. [Priority action item]
2. [Medium‑priority task]
3. [Long‑term improvement suggestion]

**Conclusion:** [Final assessment of project readiness and key focus areas]
