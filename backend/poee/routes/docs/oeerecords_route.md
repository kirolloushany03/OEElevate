**Add OEE Record for Machine**

**Endpoint:**
`POST /api/machine/<int:id>/oeeRecords`

**Description:**
This endpoint allows authorized users to add a new OEE (Overall Equipment Effectiveness) record for a specific machine by its ID. The record includes run time, production time, total units, good units, and calculated OEE metrics such as availability, performance, and quality.

**Authorization:**

- Requires JWT token.
- Accessible by both admin and employee roles.

**Path Parameters:**

- `id` (integer): The ID of the machine for which the OEE record is being created.

**Request Body:**

- `run_time` (float): The total run time of the machine.
- `planned_production_time` (float): The planned production time for the machine.
- `total_units` (int): The total number of units produced.
- `ideal_cycle_time` (float): The ideal cycle time for producing one unit.
- `good_units` (int): The number of good units produced.
- `date` (string, ISO 8601 format): The date when the OEE record was created.

**Example Request:**

```json
{
  "run_time": 450,
  "planned_production_time": 500,
  "total_units": 1000,
  "ideal_cycle_time": 0.5,
  "good_units": 950,
  "date": "2024-10-25T14:30:00"
}
```

**Response:**

**Success (201):**

If the OEE record is successfully created, the new OEE record is returned:

```json
{
  "id": 123,
  "run_time": 450,
  "planned_production_time": 500,
  "total_units": 1000,
  "ideal_cycle_time": 0.5,
  "good_units": 950,
  "availability": 90.00,
  "performance": 88.00,
  "quality": 95.00,
  "oee": 75.60,
  "created_at": "2024-10-25T14:30:00",
  "machine_id": 1
}
```

**Failure (400):**

If the request body is invalid or missing required fields, a `400 Bad Request` error is returned with a message indicating the missing or incorrect fields.

```json
{
  "error": "Invalid data format"
}
```

**Calculations:**

- **Availability**: `run_time / planned_production_time`
- **Performance**: `(total_units * ideal_cycle_time) / run_time`
- **Quality**: `good_units / total_units`
- **OEE**: `availability * performance * quality`

---
**Get OEE Records for Machine**

**Endpoint:**
`GET /api/machine/<int:id>/oeeRecords`

**Description:**
This endpoint retrieves all OEE (Overall Equipment Effectiveness) records for a specific machine identified by its ID. It returns the run time, production details, and OEE metrics such as availability, performance, and quality for each record. Additionally, it includes information about when and by whom the record was last modified.

**Authorization:**

- Requires JWT token.
- Accessible by both admin and employee roles.

**Path Parameters:**

- `id` (integer): The ID of the machine for which OEE records are being retrieved.

**Response:**

**Success (200):**

If OEE records are found, it returns a list of all records for the machine:

```json
[
  {
    "id": 101,
    "machine": {
      "id": 1,
      "name": "Machine_1"
    },
    "run_time": 450,
    "planned_production_time": 500,
    "total_units": 1000,
    "ideal_cycle_time": 0.5,
    "good_units": 950,
    "availability": 90.00,
    "performance": 88.00,
    "quality": 95.00,
    "oee": 75.60,
    "date": "2024-10-15T10:30:00",
    "last-modified-info": {
      "last-modified-at": "2024-10-16T12:00:00",
      "last-modified-by": "john_doe"
    }
  },
  {
    "id": 102,
    "machine": {
      "id": 1,
      "name": "Machine_1"
    },
    "run_time": 400,
    "planned_production_time": 450,
    "total_units": 900,
    "ideal_cycle_time": 0.5,
    "good_units": 850,
    "availability": 88.89,
    "performance": 85.00,
    "quality": 94.44,
    "oee": 71.33,
    "date": "2024-10-14T09:15:00",
    "last-modified-info": {
      "last-modified-at": "Not modified",
      "last-modified-by": "unknown"
    }
  }
]
```

**Failure (404):**

If the machine with the specified ID is not found:

```json
{
  "error": "Machine not found"
}
```

**Success with No Records (200):**

If the machine exists but has no OEE records, an empty array is returned:

```json
[]
```
---
**Get Machines with Lowest OEE**

**Endpoint:**
`GET /api/machines/lowest_oee`

**Description:**
This endpoint retrieves a list of machines with the lowest average Overall Equipment Effectiveness (OEE) for the user. It ranks the machines by their average OEE in ascending order and provides additional metrics such as total good units, average availability, performance, and quality for each machine.

**Authorization:**

- Requires JWT token.
- Accessible by both admin and employee roles.

**Query Parameters:**

- `count` (integer, optional): The number of machines to retrieve. Defaults to 5 if not provided.

**Response:**

**Success (200):**

Returns a list of machines ordered by their lowest average OEE. Each machine includes its name, total good units, and average OEE metrics.

Example response:

```json
[
  {
    "id": 1,
    "name": "Machine_1",
    "good_units": 5000,
    "average_availability": 85.50,
    "average_performance": 87.20,
    "average_quality": 90.00,
    "average_oee": 73.12
  },
  {
    "id": 2,
    "name": "Machine_2",
    "good_units": 4200,
    "average_availability": 82.75,
    "average_performance": 85.40,
    "average_quality": 88.90,
    "average_oee": 70.45
  }
]
```

**Success with No Data (200):**

If no machines or records are found for the user, an empty array is returned:

```json
[]
```
---
