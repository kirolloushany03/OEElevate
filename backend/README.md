### OEE Monitoring System

#### Project Overview

The OEE (Overall Equipment Effectiveness) Monitoring System is a web application designed to help manufacturing companies monitor and analyze the effectiveness of their equipment. This system allows users to register, log in, create machines, and record OEE data for these machines. Users can then view detailed reports and statistics to improve their equipment's efficiency.

#### Key Features

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

#### Technology Stack

- **Backend**:
  - **Flask**: Web framework for building the API.
  - **SQLAlchemy**: ORM for database management.
  - **Passlib**: For hashing passwords.
  - **Flask-JWT-Extended**: For JWT authentication.
  - **SQLite**: Simple, lightweight database for storing data.

- **Frontend**:
  - **HTML/CSS/JavaScript**: For building the user interface.
  - **Bootstrap**: For responsive design and styling.

#### Endpoints

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

#### Sample Workflow

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

#### Future Enhancements

- **User Roles and Permissions**: Differentiate between admin and regular users.
- **Graphical Reports**: Provide visualizations for OEE data.
- **Notifications**: Alert users about significant changes or issues in their equipment's performance.
- **Integration with External Systems**: Allow data import/export with other manufacturing systems.
