---
name: code-review
description: "Performs a comprehensive code review for TypeScript code, identifying issues with type safety, code quality, style, performance, security, and maintainability. Provides clear feedback and suggestions for improvement."
---

# TypeScript Code Review Skill

## Purpose
This skill helps perform structured code reviews for TypeScript projects by analyzing code against TypeScript-specific criteria and providing actionable feedback.

## Review Criteria

### 1. Type Safety
- Check for proper type annotations
- Verify correct use of interfaces and types
- Look for `any` types (discourage unless absolutely necessary)
- Ensure generics are used appropriately
- Validate union and intersection types
- Check for null/undefined handling (`strictNullChecks`)

### 2. Code Quality
- Readability and clarity
- Proper naming conventions (variables, functions, classes, interfaces)
- Code organization and structure
- Avoid code duplication
- Use of TypeScript features (enums, namespaces, modules)

### 3. Style and Formatting
- Follow TypeScript style guides (TSLint, ESLint with TypeScript plugin, Prettier)
- Consistent indentation and spacing
- Proper use of semicolons
- Line length and complexity
- Import/export syntax consistency

### 4. Performance
- Identify potential bottlenecks
- Check algorithmic efficiency
- Look for unnecessary computations
- Memory usage considerations
- Optimize type checking where possible

### 5. Security
- Input validation
- Error handling
- Potential injection vulnerabilities
- Secure data handling
- Authentication and authorization checks
- Safe use of `eval` and dynamic imports

### 6. Maintainability
- Modularity and separation of concerns
- Proper abstraction levels
- Testability (considering TypeScript's type system)
- Documentation (JSDoc comments with TypeScript types)
- Clear module boundaries

### 7. TypeScript Best Practices
- Use `const`/`let` instead of `var`
- Prefer interfaces over type aliases when possible
- Use enums appropriately (or consider union types)
- Leverage decorators properly (if using)
- Correct use of async/await with proper typing
- Proper configuration of `tsconfig.json` (implied best practices)

## Output Format

Provide feedback in the following structured format:

```markdown
### TypeScript Code Review for {{file_path}}

**Overall Assessment:** [Brief summary of code quality and type safety]

#### Issues Found:
1. **[Category]:** [Description of issue]
   - **Location:** [Line numbers or section]
   - **Severity:** [Critical/High/Medium/Low]
   - **Recommendation:** [How to fix with TypeScript-specific solution]
   - **Example:** [TypeScript code snippet showing the problem and fix]

2. **[Category]:** [Description of issue]
   - **Location:** [Line numbers or section]
   - **Severity:** [Critical/High/Medium/Low]
   - **Recommendation:** [How to fix with TypeScript-specific solution]
   - **Example:** [TypeScript code snippet showing the problem and fix]

...

#### Positive Aspects:
- [Well-typed sections]
- [Good use of TypeScript features]
- [Clean code organization]
- [Other positive observations]

#### Suggestions for Improvement:
- [General improvement ideas]
- [Potential refactoring opportunities using TypeScript features]
- [Suggestions for better type safety]
