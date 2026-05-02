# API Contract

## 1. Overview

This document defines the backend REST contract for the entire project, covering both the authentication and user settings modules. All endpoints use `application/json` for both request and response bodies. While `/auth/*` endpoints handle login and verification, all `/settings/*` endpoints require an authenticated user context from an `Authorization: Bearer <accessToken>` header.

## 2. Shared Transport Rules

The frontend validates all responses with Zod schemas. Non-2xx responses must return a JSON error envelope to ensure proper domain error mapping.

### Recommended Error Envelope

```json
{
  "message": "Human-readable error description",
  "code": "OPTIONAL_MACHINE_CODE",
  "errors": {
    "field": ["validation failure message"]
  }
}
```

### Status Code Semantics

- **400**: Invalid token or code (used in password reset and MFA verification flows).
- **401**: Unauthorized or invalid current password/credentials.
- **404**: Resource not found (e.g., session ID does not exist).
- **410**: Token or MFA ticket/code has expired.
- **422**: Validation error (requires the `errors` field map).

## 3. Auth Endpoints (`/auth/*`)

| Method | Endpoint                    | Request DTO             | Success Schema                   | Notes                               |
| ------ | --------------------------- | ----------------------- | -------------------------------- | ----------------------------------- |
| POST   | `/auth/login`               | `LoginDTO`              | `loginResponseApiSchema` (union) | Can return MFA-required branch      |
| POST   | `/auth/register`            | `RegisterDTO`           | `registerApiSchema`              | Returns user and success message    |
| POST   | `/auth/verify-email`        | `VerifyEmailDTO`        | `messageApiSchema`               | Verifies account via token          |
| POST   | `/auth/resend-verification` | `ResendVerificationDTO` | `messageApiSchema`               | Re-triggers verification email      |
| POST   | `/auth/forgot-password`     | `ForgotPasswordDTO`     | `messageApiSchema`               | Sends password reset link           |
| POST   | `/auth/reset-password`      | `ResetPasswordDTO`      | `messageApiSchema`               | Updates password via token          |
| POST   | `/auth/mfa/send-email`      | `SendMfaEmailDTO`       | `messageApiSchema`               | Sends MFA code to registered email  |
| POST   | `/auth/mfa/verify-email`    | `VerifyMfaEmailDTO`     | `mfaVerifyApiSchema`             | Validates email code, returns token |
| POST   | `/auth/mfa/verify-totp`     | `VerifyMfaTotpDTO`      | `mfaVerifyApiSchema`             | Validates TOTP code, returns token  |

### Auth Payload Examples

#### POST `/auth/register`

Request:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

Success:

```json
{
  "user": {
    "id": "user-1",
    "name": "Alice",
    "email": "alice@example.com",
    "emailVerified": false
  },
  "message": "Registration successful. Please verify your email."
}
```

#### POST `/auth/login`

Request:

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Success (Normal):

```json
{
  "requiresMfa": false,
  "user": {
    "id": "user-1",
    "name": "Alice",
    "email": "alice@example.com",
    "emailVerified": true
  },
  "accessToken": "jwt-access-token"
}
```

Success (MFA Required):

```json
{
  "requiresMfa": true,
  "ticket": "mfa-ticket-123",
  "mfaType": "totp"
}
```

#### POST `/auth/verify-email`

Request:

```json
{ "token": "verify-token" }
```

Success:

```json
{ "message": "Email verified." }
```

#### POST `/auth/mfa/verify-totp`

Request:

```json
{
  "ticket": "mfa-ticket-123",
  "code": "123456"
}
```

Success:

```json
{
  "user": {
    "id": "user-1",
    "name": "Alice",
    "email": "alice@example.com",
    "emailVerified": true
  },
  "accessToken": "jwt-access-token"
}
```

## 4. Settings Endpoints (`/settings/*`)

| Method | Endpoint                                 | Request Body                                        | Success Response          |
| ------ | ---------------------------------------- | --------------------------------------------------- | ------------------------- |
| GET    | `/settings/profile`                      | none                                                | `{ user }`                |
| PUT    | `/settings/profile`                      | `UpdateProfileDTO`                                  | `{ message, user }`       |
| GET    | `/settings/security/sessions`            | none                                                | `{ sessions: Session[] }` |
| DELETE | `/settings/security/sessions/:sessionId` | none                                                | `{ message }`             |
| DELETE | `/settings/security/sessions`            | none                                                | `{ message }`             |
| POST   | `/settings/security/password`            | `ChangePasswordDTO`                                 | `{ message }`             |
| GET    | `/settings/security/mfa`                 | none                                                | `{ emailEnabled, totpEnabled }` |
| POST   | `/settings/security/mfa/totp/setup`      | `{ currentPassword }`                               | `{ setupTicket, secret, otpauthUrl }` |
| POST   | `/settings/security/mfa/totp/verify`     | `SettingsVerifyMfaTotpDTO`                          | `{ message }`             |
| POST   | `/settings/security/mfa/email/setup`     | `{ currentPassword }`                               | `{ message }`             |
| POST   | `/settings/security/mfa/email/verify`    | `SettingsVerifyMfaEmailDTO`                         | `{ message }`             |
| POST   | `/settings/security/mfa/disable`         | `DisableMfaDTO`                                     | `{ message }`             |
| GET    | `/settings/notifications`                | none                                                | `{ preferences }`         |
| PUT    | `/settings/notifications`                | `{ preferences: Partial<NotificationPreferences> }` | `{ message }`             |

### Settings Payload Examples

#### GET `/settings/profile`

Success:

```json
{
  "user": {
    "id": "user-1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "address": "123 Main Street",
    "postalCode": "10110"
  }
}
```

#### PUT `/settings/notifications`

Request:

```json
{
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "marketingEmails": false,
    "securityAlerts": true
  }
}
```

Success:

```json
{ "message": "Notification preferences saved." }
```

#### POST `/settings/security/mfa/totp/setup`

Success:

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "setupTicket": "setup-ticket",
  "otpauthUrl": "otpauth://totp/Bidmart:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Bidmart"
}
```

#### GET `/settings/security/sessions`

Success:

```json
{
  "sessions": [
    {
      "id": "session-current",
      "device": "MacBook Pro",
      "browser": "Chrome",
      "os": "macOS",
      "ip": "203.0.113.10",
      "location": "Bangkok, TH",
      "lastActive": "Just now",
      "isCurrent": true
    }
  ]
}
```

## 5. DTO Reference

### Auth DTOs

```ts
type LoginDTO = { email: string; password: string };
type RegisterDTO = { name: string; email: string; password: string };
type VerifyEmailDTO = { token: string };
type ResendVerificationDTO = { email: string };
type ForgotPasswordDTO = { email: string };
type ResetPasswordDTO = { token: string; password: string };
type VerifyMfaTotpDTO = { ticket: string; code: string };
type SendMfaEmailDTO = { ticket: string };
type VerifyMfaEmailDTO = { ticket: string; code: string };
```

### Settings DTOs

```ts
type UpdateProfileDTO = {
  name: string;
  address: string;
  postalCode: string;
};

type ChangePasswordDTO = {
  currentPassword: string;
  newPassword: string;
};

type SetupMfaTotpDTO = { currentPassword: string };
type SettingsVerifyMfaTotpDTO = {
  setupTicket: string;
  code: string;
  currentPassword: string;
};
type SetupMfaEmailDTO = { currentPassword: string };
type SettingsVerifyMfaEmailDTO = { code: string; currentPassword: string };
type DisableMfaDTO = { currentPassword: string };
type RevokeSessionDTO = { sessionId: string };

type UpdateNotificationPreferencesDTO = {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
};
```

## 6. Response Schema Reference

### Shared & Auth Schemas

- **User**: `{ id: string; name: string; email: string; emailVerified: boolean }`
- **Message**: `{ message: string }`
- **Authenticated requests**: send `Authorization: Bearer <accessToken>`. The frontend keeps this access token in module-scope memory only; it is not stored in cookies, `localStorage`, or `sessionStorage`.
- **Login Response**:
  - MFA required: `{ requiresMfa: true; ticket: string; mfaType: "totp" | "email" }`
  - Success: `{ requiresMfa?: false; user: User; accessToken: string }`
- **MFA Verify**: `{ user: User; accessToken: string }`

### Settings Schemas

- **Profile User**: `{ id: string; name: string; email: string; address: string; postalCode: string }`
- **Session**: `{ id: string; device: string; browser: string; os: string; ip: string; location: string; lastActive: string; isCurrent: boolean }`
- **MFA Status**: `{ emailEnabled: boolean; totpEnabled: boolean }`
- **TOTP Setup**: `{ setupTicket: string; secret: string; otpauthUrl: string }`
- **Notification Preferences**: `{ emailNotifications: boolean; pushNotifications: boolean; marketingEmails: boolean; securityAlerts: boolean }`

## 7. Error Mapping

### Shared Mappings

- **404** -> `NotFoundError`
- **410** -> `GoneError`
- **422** -> `ValidationError`

### Auth-Specific Remapping

- `POST /auth/reset-password`:
  - `GoneError` -> `TokenExpiredError`
  - `400` -> `InvalidResetTokenError`
- `POST /auth/mfa/verify-*`:
  - `GoneError` -> `MfaExpiredError`
- `POST /auth/login`:
  - `requiresMfa: true` -> `MfaRequiredError` (Control-flow signal)

### Settings-Specific Remapping

- `DELETE /settings/security/sessions/:sessionId`:
  - `404` -> `SessionNotFoundError`
- `POST /settings/security/password`:
  - `401` -> `InvalidCurrentPasswordError`
- `POST /settings/security/mfa/*/verify`:
  - `400` -> `InvalidMfaCodeError`
- `POST /settings/security/mfa/disable`:
  - `401` -> `InvalidCurrentPasswordError`

## 8. Frontend Route-to-API Map

| Frontend Route                       | API Calls                                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `/login`                             | `POST /auth/login`                                                                                                |
| `/register`                          | `POST /auth/register`                                                                                             |
| `/auth/check-email`                  | `POST /auth/resend-verification`                                                                                  |
| `/auth/verify-email?token=...`       | `POST /auth/verify-email`                                                                                         |
| `/auth/forgot-password`              | `POST /auth/forgot-password`                                                                                      |
| `/auth/reset-password?token=...`     | `POST /auth/reset-password`                                                                                       |
| `/auth/mfa/totp`                     | `POST /auth/mfa/verify-totp`                                                                                      |
| `/auth/mfa/email`                    | `POST /auth/mfa/send-email`, `POST /auth/mfa/verify-email`                                                        |
| `/settings/profile`                  | `GET /settings/profile`, `PUT /settings/profile`                                                                  |
| `/settings/notifications`            | `GET /settings/notifications`, `PUT /settings/notifications`                                                      |
| `/settings/security/password`        | `POST /settings/security/password`                                                                                |
| `/settings/security/sessions`        | `GET /settings/security/sessions`, `DELETE /settings/security/sessions/:id`, `DELETE /settings/security/sessions` |
| `/settings/security/mfa`             | `GET /settings/security/mfa`                                                                                      |
| `/settings/security/mfa/totp/setup`  | `POST /settings/security/mfa/totp/setup`, `POST /settings/security/mfa/totp/verify`                               |
| `/settings/security/mfa/email/setup` | `POST /settings/security/mfa/email/setup`, `POST /settings/security/mfa/email/verify`                             |
| `/settings/security/mfa/disable`     | `POST /settings/security/mfa/disable`                                                                             |

## 9. Backend Integration Checklist

- [ ] Every endpoint path and method matches the inventory tables exactly.
- [ ] Login supports both success branches (`requiresMfa` true and false).
- [ ] `user` object fields match schemas exactly (note additional fields in settings profile).
- [ ] Response wrappers are correct (`user`, `sessions`, `preferences`, `message`).
- [ ] Error responses consistently include a `message` field.
- [ ] Validation errors (`422`) include the `errors` object by field.
- [ ] Required status codes are respected (`400`, `401`, `404`, `410`, `422`).
- [ ] `PUT /settings/notifications` accepts the wrapped body `{ preferences: ... }`.
- [ ] TOTP setup returns `setupTicket`, `secret`, and `otpauthUrl`.
- [ ] MFA status shape exactly matches (`emailEnabled`, `totpEnabled`).
