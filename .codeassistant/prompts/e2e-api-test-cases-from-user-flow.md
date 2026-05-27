---
name: E2E & API Test Cases from User Flow
description: Open the site at https://www.saucedemo.com/ and analyze the main user scenarios (user flows). Generate a separate file test_cases_e2e_api.md with test cases for E2E and API tests.
---

**Prompt:**

Open the site at https://www.saucedemo.com/ and analyze the main user scenarios (user flows). For login use given creds: username: `standard_user`, password: `secret_sauce`. 

Generate a separate file `test_cases_e2e_api.md` with test cases for:

1. **E2E tests**: full scenarios from user login to goal achievement (registration, order placement, etc.). Use the format from point 3.

2. **API tests**: verification of individual endpoints used in these scenarios (GET, POST, PUT, DELETE). For API cases, include the following columns:
   - **HTTP Method**
   - **URL**
   - **Request Body (JSON)**
   - **Headers**
   - **Expected Status Code**

---

### Example structure for the `test_cases_e2e_api.md` file

#### E2E Test Cases

| Test Case ID | Description | Steps | Expected Result |
|------------|-------------|-------|---------------|
| E2E‑001 | User registration and login | 1. Open the site.<br>2. Click “Register”.<br>3. Fill in the registration form.<br>4. Click “Submit”.<br>5. Log in with the new credentials. | User is registered and successfully logged in; redirected to the dashboard. |
| E2E‑002 | Place an order | 1. Log in to the account.<br>2. Browse products and add one to the cart.<br>3. Go to the cart.<br>4. Proceed to checkout.<br>5. Fill in shipping details.<br>6. Confirm the order. | Order is placed successfully; user receives an order confirmation. |

#### API Test Cases

| Test Case ID | Description | HTTP Method | URL | Request Body (JSON) | Headers | Expected Status Code |
|------------|-------------|-------------|-----|--------------------|---------|--------------------|
| API‑001 | Create a new user | POST | `/api/users` | `{"name": "John Doe", "email": "john@example.com", "password": "secure123"}` | `Content‑Type: application/json` | `201 Created` |
| API‑002 | Get user details | GET | `/api/users/{id}` | — | `Authorization: Bearer <token>` | `200 OK` |
| API‑003 | Update user profile | PUT | `/api/users/{id}` | `{"name": "Jane Doe", "email": "jane@example.com"}` | `Authorization: Bearer <token>`, `Content‑Type: application/json` | `200 OK` |
| API‑004 | Delete a user | DELETE | `/api/users/{id}` | — | `Authorization: Bearer <token>` | `204 No Content` |
