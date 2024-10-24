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
---
### Get Machine by ID

**Endpoint**:  
`GET /api/machines/<int:id>`

**Description**:  
This endpoint retrieves a machine by its ID along with its OEE records and performance summary. It calculates the sum of good units and averages of availability, performance, quality, and OEE for the machine.

**Authorization**:  
- Requires JWT token.
- Accessible by both admin and employee roles.

**Path Parameters**:
- `id` (integer): The ID of the machine.

**Response**:

**Success (200)**:

- If the machine is found, returns its data and OEE records:

```json
{
  "id": 1,
  "name": "Machine_1",
  "entries": [
    {
      "id": 101,
      "run_time": 500,
      "planned_production_time": 600,
      "total_units": 1000,
      "ideal_cycle_time": 0.5,
      "good_units": 950,
      "availability": 83.33,
      "performance": 90.00,
      "quality": 95.00,
      "oee": 71.25,
      "created_at": "2024-10-15T10:30:00Z"
    },
    {
      "id": 102,
      "run_time": 450,
      "planned_production_time": 550,
      "total_units": 900,
      "ideal_cycle_time": 0.5,
      "good_units": 880,
      "availability": 81.82,
      "performance": 92.73,
      "quality": 97.78,
      "oee": 74.00,
      "created_at": "2024-10-14T09:15:00Z"
    }
  ],
  "good_units": 1830,
  "average_availability": 82.58,
  "average_performance": 91.36,
  "average_quality": 96.39,
  "average_oee": 72.63,
  "created_at": "2024-10-01T08:00:00Z"
}
```

**Failure (404)**:

- **Machine not found** (if the machine ID doesn't exist or doesn't belong to the current user):

```json
{
  "error": "Machine not found"
}
```

**Failure (403)**:

- If the user is unauthorized to access the machine, a forbidden response will be returned (handled by decorator).
---
