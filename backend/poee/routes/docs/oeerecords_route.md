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

