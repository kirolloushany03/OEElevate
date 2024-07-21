# OEE Monitoring System

## Project Overview

The OEE (Overall Equipment Effectiveness) Monitoring System is a web application designed to help manufacturing companies monitor and analyze the effectiveness of their equipment. This system allows users to register, log in, create machines, and record OEE data for these machines. Users can then view detailed reports and statistics to improve their equipment's efficiency.

## Key Features

1. **User Authentication**:
   - **Registration**: Users can create an account by providing their full name, company name, email, and password.
   - **Login**: Users can log in to the system using their email and password.
   - **JWT Authentication**: Secure user sessions using JSON Web Tokens.

2. **Machine Management**:
   - **Create Machine**: Authenticated users can create new machines by providing the machine name.
   - **List Machines**: Users can view a list of all machines they have created.
   - **Machine Details**: Users can view detailed information about a specific machine, including all OEE records associated with it.

3. **OEE Data Recording**:
   - **Add OEE Record**: Users can add OEE records to a machine, including run time, planned production time, total units, ideal cycle time, and good units.

4. **Reporting and Analysis**:
   - **Machine Summary**: View a summary of each machine's performance, including the sum of good units, average availability, average performance, average quality, and average OEE.
   - **OEE Records**: Detailed view of all OEE records for a machine.

## Technology Stack

- **Backend**:
  - **Flask**: Web framework for building the API.
  - **SQLAlchemy**: ORM for database management.
  - **Passlib**: For hashing passwords.
  - **Flask-JWT-Extended**: For JWT authentication.
  - **SQLite**: Simple, lightweight database for storing data.

- **Frontend**:
  - **HTML/CSS/JavaScript**: For building the user interface.
  - **Bootstrap**: For responsive design and styling.

## Endpoints

1. **User Authentication**:
   - `POST /api/auth/register`: Register a new user.
   - `POST /api/auth/login`: Log in a user and return a JWT.
   - `GET /api/user`: Get the current user's information.

2. **Machine Management**:
   - `POST /api/machines`: Create a new machine.
   - `GET /api/machines`: List all machines for the authenticated user.
   - `GET /api/machines/<int:id>`: Get detailed information about a specific machine.

3. **OEE Data Recording**:
   - `POST /api/oee_records`: Add a new OEE record to a machine.
   - `GET /api/oee_records`: Get all OEE records (for development/testing purposes).

## Sample Workflow

1. **User Registration and Login**:
   - The user registers with their full name, company name, email, and password.
   - After registration, the user logs in with their email and password to receive a JWT.

2. **Machine Management**:
   - The user creates a machine by providing a machine name.
   - The user views a list of their machines.
   - The user selects a machine to view detailed information and OEE records.

3. **OEE Data Recording**:
   - The user adds OEE records to a machine, including run time, planned production time, total units, ideal cycle time, and good units.

4. **Reporting and Analysis**:
   - The user views a summary of the machine's performance, including aggregated data such as good units, availability, performance, quality, and OEE.

## Future Enhancements

- **User Roles and Permissions**: Differentiate between admin and regular users.
- **Graphical Reports**: Provide visualizations for OEE data.
- **Notifications**: Alert users about significant changes or issues in their equipment's performance.
- **Integration with External Systems**: Allow data import/export with other manufacturing systems.
-----------------------------------------------------------------------------------------------------------
Certainly! Here's a full README file that contains all the documentation for the API endpoints you provided.

---

# POEE API Documentation

This is the documentation for the POEE API, which provides various endpoints for user authentication, machine management, and OEE (Overall Equipment Effectiveness) calculations.

## Table of Contents
1. [Check Server Status](#check-server-status)
2. [User Authentication](#user-authentication)
   - [Register](#register)
   - [Login](#login)
   - [Refresh Token](#refresh-token)
   - [Get User Info](#get-user-info)
   - [Request Password Reset](#request-password-reset)
   - [Reset Password](#reset-password)
3. [Machine Management](#machine-management)
   - [Create Machine](#create-machine)
   - [Get All Machines Info](#get-all-machines-info)
   - [Get Machine By ID](#get-machine-by-id)
   - [Get Machine Summary](#get-machine-summary)
4. [OEE Records](#oee-records)
   - [Add OEE Record](#add-oee-record)
   - [Get OEE Records](#get-oee-records)
5. [Dashboard](#dashboard)
   - [Get Machines with Lowest OEE](#get-machines-with-lowest-oee)
   - [Get Bad Units Rate](#get-bad-units-rate)

## Check Server Status
**Endpoint:** `/api`  
**Method:** `GET`

**Description:** Checks if the server is up and running.

**Response:**
- **Success (200):**
  ```
  Server is up and running
  ```

## User Authentication

### Register
**Endpoint:** `/api/auth/register`  
**Method:** `POST`

**Description:** Registers a new user.

**Request:**
- `username` (string, required): The user's username.
- `company_name` (string, required): The user's company name.
- `email` (string, required): The user's email.
- `password` (string, required): The user's password.

**Response:**
- **Success (200):**
  ```json
  {
    "message": "Congratulations, you registered successfully"
  }
  ```
- **Errors:**
  - Missing required field (400):
    ```json
    {
      "error": "Missing required field"
    }
    ```
  - Email or username already taken (400):
    ```json
    {
      "error": "The email is already taken, choose another one and the username is already taken, choose another one"
    }
    ```

### Login
**Endpoint:** `/api/auth/login`  
**Method:** `POST`

**Description:** Logs in a user.

**Request:**
- `email` (string, required): The user's email.
- `password` (string, required): The user's password.

**Response:**
- **Success (200):**
  ```json
  {
    "access_token": "access_token_value",
    "refresh_token": "refresh_token_value"
  }
  ```
- **Errors:**
  - Invalid credentials (400):
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

### Refresh Token
**Endpoint:** `/api/auth/refresh`  
**Method:** `POST`  
**Authentication:** JWT Refresh Token required

**Description:** Refreshes the access token.

**Request:** None

**Response:**
- **Success (200):**
  ```json
  {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
  ```

### Get User Info
**Endpoint:** `/api/user`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves the information of the logged-in user.

**Response:**
- **Success (200):**
  ```json
  {
    "username": "user_username",
    "company_name": "user_company_name",
    "email": "user_email",
    "created_at": "user_created_at"
  }
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```

### Request Password Reset
**Endpoint:** `/api/auth/request_reset`  
**Method:** `POST`

**Description:** Requests a password reset link to be sent to the user's email.

**Request:**
- `email` (string, required): The user's email.

**Response:**
- **Success (200):**
  ```json
  {
    "message": "Password reset link has been sent to your email."
  }
  ```
- **Errors:**
  - Missing email (400):
    ```json
    {
      "error": "Email is required"
    }
    ```
  - User not found (404):
    ```json
    {
      "error": "User not found"
    }
    ```

### Reset Password
**Endpoint:** `/api/auth/reset_password/<token>`  
**Method:** `POST`

**Description:** Resets the user's password using a token.

**Request:**
- URL Parameter: `token` (string, required): The token sent to the user's email.
- JSON Body:
  - `password` (string, required): The new password.

**Response:**
- **Success (200):**
  ```json
  {
    "message": "Password has been reset successfully"
  }
  ```
- **Errors:**
  - Invalid or expired token (400):
    ```json
    {
      "error": "The reset link is invalid or has expired"
    }
    ```
  - Missing password (400):
    ```json
    {
      "error": "Password is required"
    }
    ```
  - User not found (404):
    ```json
    {
      "error": "User not found"
    }
    ```

## Machine Management

### Create Machine
**Endpoint:** `/api/machines`  
**Method:** `POST`  
**Authentication:** JWT Token required

**Description:** Creates a new machine.

**Request:**
- `machine_name` (string, required): The name of the machine.

**Response:**
- **Success (200):**
  ```json
  {
    "id": "machine_id",
    "machine_name": "machine_name",
    "created_at": "machine_created_at"
  }
  ```
- **Errors:**
  - Missing machine name (400):
    ```json
    {
      "error": "Missing required field: machine_name"
    }
    ```
  - Machine name already exists (400):
    ```json
    {
      "error": "The machine name already exists"
    }
    ```

### Get All Machines Info
**Endpoint:** `/api/machines`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves all machines associated with the logged-in user.

**Response:**
- **Success (200):**
  ```json
  [
    {
      "id": "machine_id",
      "machine_name": "machine_name",
      "latest_entry": "latest_entry_date",
      "created_at": "machine_created_at"
    },
    ...
  ]
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```
  - No machines found (200):
    ```json
    {
      "message": "No machines for this user"
    }
    ```

### Get Machine By ID
**Endpoint:** `/api/machines/<int:id>`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves a machine by its ID.

**Response:**
- **Success (200):**
  ```json
  {
    "id": "machine_id",
    "name": "machine_name",
    "entries": [
      {
        "id": "entry_id",
        "run_time": "entry_run_time",
        "planned_production_time": "entry_planned_production_time",
        "total_units": "entry_total_units",
        "ideal_cycle_time": "entry_ideal_cycle_time",
        "good_units": "entry_good_units",
        "availability": "entry_availability",
        "performance": "entry_performance",
        "quality": "entry_quality",
        "oee": "entry_oee",
        "created_at": "entry_created_at"
      },
      ...
    ],
    "good_units": "total_good_units",
    "average_availability": "average_availability",
    "average_performance": "average_performance",
    "average_quality": "average_quality",
    "average_oee": "average_oee",
    "created_at": "machine_created_at"
  }
  ```
- **Errors:**
  - Machine not found (404):
    ```json
    {
      "error": "Machine not found"
    }
    ```

### Get Machine Summary
**Endpoint:** `/api/machines/summary`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves a summary of all machines associated with the logged-in user.

**Response:**
- **Success (200):**
  ```json
  [
    {
      "id": "machine_id",
      "machine_name": "machine_name",
      "latest_entries": [
        {
          "created_at": "entry_created_at",
          "good_units": "entry_good_units",
          "availability": "entry_availability",
          "performance": "entry_performance",
          "quality": "entry_quality",
          "oee": "entry_oee"
        },
        ...
      ],
      "total_good_units": "total_good_units",
      "average_availability": "average_av

ailability",
      "average_performance": "average_performance",
      "average_quality": "average_quality",
      "average_oee": "average_oee"
    },
    ...
  ]
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```

## OEE Records

### Add OEE Record
**Endpoint:** `/api/oees`  
**Method:** `POST`  
**Authentication:** JWT Token required

**Description:** Adds a new OEE record for a machine.

**Request:**
- `machine_id` (integer, required): The ID of the machine.
- `run_time` (integer, required): The run time of the machine.
- `planned_production_time` (integer, required): The planned production time of the machine.
- `total_units` (integer, required): The total units produced.
- `ideal_cycle_time` (integer, required): The ideal cycle time of the machine.
- `good_units` (integer, required): The number of good units produced.

**Response:**
- **Success (200):**
  ```json
  {
    "id": "oee_record_id",
    "machine_id": "machine_id",
    "run_time": "run_time",
    "planned_production_time": "planned_production_time",
    "total_units": "total_units",
    "ideal_cycle_time": "ideal_cycle_time",
    "good_units": "good_units",
    "availability": "availability",
    "performance": "performance",
    "quality": "quality",
    "oee": "oee",
    "created_at": "created_at"
  }
  ```
- **Errors:**
  - Missing required fields (400):
    ```json
    {
      "error": "Missing required fields"
    }
    ```

### Get OEE Records
**Endpoint:** `/api/oees`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves all OEE records associated with the logged-in user.

**Response:**
- **Success (200):**
  ```json
  [
    {
      "id": "oee_record_id",
      "machine_id": "machine_id",
      "run_time": "run_time",
      "planned_production_time": "planned_production_time",
      "total_units": "total_units",
      "ideal_cycle_time": "ideal_cycle_time",
      "good_units": "good_units",
      "availability": "availability",
      "performance": "performance",
      "quality": "quality",
      "oee": "oee",
      "created_at": "created_at"
    },
    ...
  ]
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```

## Dashboard

### Get Machines with Lowest OEE
**Endpoint:** `/api/dashboard/lowest_oee`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves machines with the lowest OEE for the logged-in user.

**Response:**
- **Success (200):**
  ```json
  [
    {
      "id": "machine_id",
      "machine_name": "machine_name",
      "latest_entry": {
        "oee": "entry_oee",
        "created_at": "entry_created_at"
      }
    },
    ...
  ]
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```

### Get Bad Units Rate
**Endpoint:** `/api/dashboard/bad_units_rate`  
**Method:** `GET`  
**Authentication:** JWT Token required

**Description:** Retrieves the rate of bad units for each machine associated with the logged-in user.

**Response:**
- **Success (200):**
  ```json
  [
    {
      "machine_id": "machine_id",
      "machine_name": "machine_name",
      "bad_units_rate": "bad_units_rate"
    },
    ...
  ]
  ```
- **Errors:**
  - User not found (400):
    ```json
    {
      "error": "User not found"
    }
    ```
