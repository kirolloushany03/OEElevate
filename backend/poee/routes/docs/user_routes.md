### Get User Information

**Endpoint:**
`GET /api/user`

**Description:**
This endpoint retrieves information about the currently authenticated user. It provides details such as the user's username, email, associated company name, creation date, and whether the user is an employee.

**Authorization:**

- Requires JWT token.
- Accessible by authenticated users only.

**Response:**

**Success (200):**

Returns user information, including the username, company name, email, account creation date, and employment status.

Example response:

```json
{
  "username": "john_doe",
  "company_name": "Example Corp",
  "email": "john@example.com",
  "created_at": "2024-01-01T10:00:00Z",
  "is_employee": true
}
```

**Failure Responses:**

- **400 Bad Request:**
  If the user is not found, it returns:
  ```json
  {
    "error": "user not found"
  }
  ```

---
