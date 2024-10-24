### Get Machine Performance Summary

**Endpoint:**
`GET /api/summarize/<int:machine_id>`

**Description:**
This endpoint retrieves a performance summary for a specific machine based on its latest OEE (Overall Equipment Effectiveness) record. It provides insights into the machine's availability, performance, quality, and OEE score. Additionally, it generates a brief analysis and suggests improvements based on the machine's performance metrics.

**Authorization:**

- Requires JWT token.
- Accessible by authenticated users.

**Path Parameters:**

- `machine_id` (integer): The ID of the machine to summarize.

**Response:**

**Success (200):**

Returns a summary of the machine's performance, including suggestions for improvement.

Example response:

```json
{
  "summary": "The machine 'Machine_1' has an availability of 85%, performance of 75%, and quality of 90%. To improve, focus on reducing downtime and optimizing production speed."
}
```

**Failure Responses:**

- **400 Bad Request:**
  If the `machine_id` is not provided, it returns:
  ```json
  {
    "error": "machine_id is required"
  }
  ```

- **404 Not Found:**
  If the machine is not found or has no OEE records, it returns:
  ```json
  {
    "error": "Machine not found"
  }
  ```
  or
  ```json
  {
    "error": "No OEE records found for this machine"
  }
  ```

- **500 Internal Server Error:**
  If an unexpected error occurs during processing, it returns:
  ```json
  {
    "error": "<error message>"
  }
  ```

---
