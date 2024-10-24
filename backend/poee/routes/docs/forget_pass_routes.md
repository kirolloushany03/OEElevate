### Request Password Reset

**Endpoint**:  
`POST /api/auth/request_reset`

**Description**:  
This endpoint allows users to request a password reset link, which is sent to their registered email address. 

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

**Success (200)**:

- If the email is valid and the user exists, a password reset link is sent to the email.

```json
{
  "message": "Password reset link has been sent to your email."
}
```

**Failure (400)**:

- **Email not provided**:

```json
{
  "error": "Email is required"
}
```

**Failure (404)**:

- **User not found**:

```json
{
  "error": "User not found"
}
```

---

### Reset Password

**Endpoint**:  
`POST /api/auth/reset_password/<token>`

**Description**:  
This endpoint allows users to reset their password using the token provided in the password reset link.

**Request Parameters**:

- **token**: The token generated and sent to the user's email for password reset.

**Request Body**:

```json
{
  "password": "new_password"
}
```

**Response**:

**Success (200)**:

- If the token is valid and the password is reset:

```json
{
  "message": "Password has been reset successfully"
}
```

**Failure (400)**:

- **Invalid or expired token**:

```json
{
  "error": "The reset link is invalid or has expired"
}
```

- **Password not provided**:

```json
{
  "error": "Password is required"
}
```

**Failure (404)**:

- **User not found**:

```json
{
  "error": "User not found"
}
```