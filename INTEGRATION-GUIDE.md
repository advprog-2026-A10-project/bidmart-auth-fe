# Integration Guide

This document is the frontend-to-backend integration reference for `bidmart-auth-fe`. Read it alongside `API-CONTRACT.md`.

## 1. Project Architecture

- Framework: React Router v7.
- HTTP client: `app/shared/infrastructure/http/api-client.ts`.
- API validation: Zod schemas at the infrastructure boundary.
- State: no global store. The current user and access token live in module-level memory for the active browser session only.
- Architecture: domain, application, infrastructure, and presentation layers.

Relevant shared infrastructure:

```txt
app/shared/infrastructure/http/api-client.ts
app/shared/infrastructure/auth/access-token.ts
app/modules/auth/infrastructure/current-user-state.ts
```

## 2. Environment

Frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Backend:

```env
APP_DATABASE_URL=postgres://postgres:postgres@localhost:5432/bidmart_auth
APP_AUTH_JWT_SECRET=dev-only-change-me-dev-only-change-me
APP_RESEND_API_KEY=re_xxx
APP_RESEND_FROM_EMAIL=Bidmart <noreply@bidmart.bid>
APP_VERIFY_EMAIL_URL_BASE=http://127.0.0.1:5173/auth/verify-email?token=
APP_PASSWORD_RESET_URL_BASE=http://127.0.0.1:5173/auth/reset-password?token=
```

Do not hardcode secrets or public domains in source.

## 3. HTTP Client Behavior

All requests go through `apiClient`.

| Behavior                              | Detail                                                   |
| ------------------------------------- | -------------------------------------------------------- |
| `Content-Type: application/json`      | JSON request bodies.                                     |
| `Accept: application/json`            | JSON responses expected.                                 |
| `Authorization: Bearer <accessToken>` | Added only when an access token exists in module memory. |
| `credentials: "same-origin"`          | Cross-origin API calls do not send browser cookies.      |
| 204 No Content                        | Returned as `undefined`.                                 |
| Error parsing                         | Non-2xx JSON errors are mapped before throwing.          |

CORS should allow the frontend origin, methods `GET, POST, PUT, DELETE, OPTIONS`, and headers `Content-Type, Accept, Authorization`. Authenticated cross-origin requests use the `Authorization` header, not browser cookies.

## 4. Auth State Model

The frontend keeps authenticated state only for the active browser session:

1. `setCurrentUser()` / `getCurrentUser()` store the authenticated user in module memory.
2. `setAccessToken()` / `getAccessToken()` store the Bearer token in module memory.
3. `mfa-ticket-storage.ts` stores only the short-lived MFA ticket while the user completes the MFA challenge.

The access token must not be stored in cookies, `localStorage`, `sessionStorage`, URLs, logs, telemetry, toast messages, or visible UI.

Successful login and MFA verification return JSON:

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

Later authenticated requests use:

```http
Authorization: Bearer <accessToken>
```

The backend must not set auth cookies and must not accept a cookie fallback for authenticated routes.

## 5. Auth Routes and Flows

### Login

- Route: `/login`
- API: `POST /auth/login`
- Normal branch: `{ requiresMfa: false, user, accessToken }`, then navigate to `/posts`.
- MFA branch: `{ requiresMfa: true, ticket, mfaType }`, then navigate to `/auth/mfa` with router state. The MFA gate stores the ticket out of the URL and redirects to `/auth/mfa/totp` or `/auth/mfa/email`.

### Register and Email Verification

- Route: `/register`
- API: `POST /auth/register`
- Success route: `/auth/check-email`
- Resend API: `POST /auth/resend-verification`

Email verification routes:

- `/auth/verify-email?token=...`
- `/auth/verify-email/success`
- `/auth/verify-email/expired`
- `/auth/verify-email/invalid`

`POST /auth/verify-email` maps expired tokens to `410` and invalid tokens to `400`.

### Forgot and Reset Password

- `/auth/forgot-password`
- `/auth/forgot-password/sent`
- `/auth/reset-password?token=...`
- `/auth/reset-password/success`
- `/auth/reset-password/expired`
- `/auth/reset-password/invalid`

APIs:

- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Forgot password must return a generic success message even if the account is unknown or not eligible. Reset password maps expired tokens to `410` and invalid tokens to `400`.

### Login MFA

Routes:

- `/auth/mfa`
- `/auth/mfa/offer`
- `/auth/mfa/totp`
- `/auth/mfa/email`
- `/auth/mfa/expired`

APIs:

- `POST /auth/mfa/send-email`
- `POST /auth/mfa/verify-email`
- `POST /auth/mfa/verify-totp`

MFA verification endpoints redeem the short-lived MFA ticket and only then return `{ user, accessToken }`.

## 6. Settings MFA

All settings routes require `Authorization: Bearer <accessToken>`.

Routes:

- `/settings/security/mfa`
- `/settings/security/mfa/totp/setup`
- `/settings/security/mfa/email/setup`
- `/settings/security/mfa/disable`

APIs:

| Action       | Method and endpoint                        | Request                                  | Response                              |
| ------------ | ------------------------------------------ | ---------------------------------------- | ------------------------------------- |
| Status       | `GET /settings/security/mfa`               | none                                     | `{ emailEnabled, totpEnabled }`       |
| TOTP setup   | `POST /settings/security/mfa/totp/setup`   | `{ currentPassword }`                    | `{ setupTicket, secret, otpauthUrl }` |
| TOTP verify  | `POST /settings/security/mfa/totp/verify`  | `{ setupTicket, code, currentPassword }` | `{ message }`                         |
| Email setup  | `POST /settings/security/mfa/email/setup`  | `{ currentPassword }`                    | `{ message }`                         |
| Email verify | `POST /settings/security/mfa/email/verify` | `{ code, currentPassword }`              | `{ message }`                         |
| Disable MFA  | `POST /settings/security/mfa/disable`      | `{ currentPassword }`                    | `{ message }`                         |

Settings MFA setup, verification, and disable requests must include `currentPassword`.

## 7. Error Mapping

| HTTP status | Frontend mapping                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| 400         | `NetworkError`; reset password remaps to `InvalidResetTokenError`, MFA setup can remap to `InvalidMfaCodeError`. |
| 401         | `NetworkError`; wrong current password remaps to `InvalidCurrentPasswordError`.                                  |
| 404         | `NotFoundError`.                                                                                                 |
| 410         | `GoneError`; reset password remaps to `TokenExpiredError`, MFA auth remaps to `MfaExpiredError`.                 |
| 422         | `ValidationError`.                                                                                               |

All non-2xx responses should include a JSON `message`; validation responses should include field errors.

## 8. Integration Checklist

- [ ] `VITE_API_BASE_URL` points to the backend.
- [ ] Backend CORS allows the frontend origin and `Authorization` header.
- [ ] `POST /auth/register` creates an unverified user and sends verification through Resend.
- [ ] `POST /auth/resend-verification` enforces cooldown and returns a non-enumerating response.
- [ ] `POST /auth/verify-email` handles success, expired, and invalid tokens.
- [ ] `POST /auth/login` blocks unverified users and returns either normal success or MFA-required branch.
- [ ] MFA verification redeems the MFA ticket before issuing an access token.
- [ ] Forgot password sends a Resend email and does not leak account existence.
- [ ] Reset password tokens are hashed, expiring, and single-use.
- [ ] Settings MFA setup/verify/disable flows require authenticated Bearer requests.
- [ ] Access tokens are never persisted outside module memory.
