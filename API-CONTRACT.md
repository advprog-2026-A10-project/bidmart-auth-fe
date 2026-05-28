# BidMart Auth API Contract (FE-facing)

Base URL: `VITE_API_BASE_URL`

## Auth Endpoints

### POST `/auth/register`

Request (canonical):

```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "password": "StrongPassword123!",
  "confirmPassword": "StrongPassword123!"
}
```

Legacy compatibility:

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "StrongPassword123!"
}
```

### POST `/auth/login`

Request:

```json
{ "email": "alice@example.com", "password": "StrongPassword123!" }
```

Response (no MFA):

```json
{
  "requiresMfa": false,
  "user": { "id": "...", "name": "Alice Johnson", "email": "alice@example.com", "emailVerified": true },
  "accessToken": "..."
}
```

Response (MFA required):

```json
{
  "requiresMfa": true,
  "ticket": "...",
  "mfaType": "totp"
}
```

### POST `/auth/mfa/send-email`
### POST `/auth/mfa/verify-email`
### POST `/auth/mfa/verify-totp`

- `verify-*` responses include `{ user, accessToken }`.

### POST `/auth/logout`

- Revokes current active session and clears `auth_session` cookie.
- Response: `{ "message": "Logout successful." }`

### POST `/auth/validate`

- Accepts bearer token and/or `auth_session` cookie.
- Response shape:

```json
{
  "userId": "...",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "emailVerified": true,
  "mfaSatisfied": true,
  "sessionExpiry": "2026-01-01T01:00:00+00:00"
}
```

## Settings Endpoints

- `GET|PUT /settings/profile`
- `POST /settings/security/password`
- `GET|DELETE /settings/security/sessions`
- `DELETE /settings/security/sessions/:id`
- `GET /settings/security/mfa`
- `POST /settings/security/mfa/totp/setup`
- `POST /settings/security/mfa/totp/verify`
- `POST /settings/security/mfa/email/setup`
- `POST /settings/security/mfa/email/verify`
- `POST /settings/security/mfa/disable`
- `GET|PUT /settings/notifications`

