### Create Machine

**Endpoint**:  
`POST /api/machines`

**Description**:  
This endpoint allows an admin user to create a new machine under their factory.

**Authorization**:  
- Requires JWT token.
- Admin-only access.

**Request Body**:

```json
{
  "machine_name": "Machine_1"
}
```

**Response**:

**Success (200)**:

- If the machine is created successfully:

```json
{
  "id": 1,
  "machine_name": "Machine_1",
  "created_at": "2024-10-17T10:00:00Z"
}
```

**Failure (400)**:

- **Missing `machine_name` field**:

```json
{
  "error": "Missing required field: machine_name"
}
```

- **Machine with the same name already exists**:

```json
{
  "errors": "the machine name already exists"
}
```

**Failure (404)**:

- **User not found** (when fetching user from the JWT token):

```json
{
  "error": "user not found"
}
```