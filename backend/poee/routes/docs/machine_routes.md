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
---
### Get All Machines Info

**Endpoint**:  
`GET /api/machines`

**Description**:  
This endpoint retrieves all machines associated with the user's factory. Both admin and employee roles can access this route.

**Authorization**:  
- Requires JWT token.
- Accessible by both admin and employee.

**Response**:

**Success (200)**:

- If machines exist for the factory:

```json
[
  {
    "id": 1,
    "machine_name": "Machine_1",
    "latest_entry": "2024-10-17T10:00:00Z",  // Latest OEE record entry (optional)
    "created_at": "2024-10-01T09:30:00Z"
  },
  {
    "id": 2,
    "machine_name": "Machine_2",
    "latest_entry": null,  // No OEE record found for this machine
    "created_at": "2024-10-02T08:15:00Z"
  }
]
```

- If no machines are found:

```json
[]
```

**Failure (404)**:

- **User not found** (when fetching user from the JWT token):

```json
{
  "error": "user not found"
}
```