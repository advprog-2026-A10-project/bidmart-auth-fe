# Integration Guide

This document is the **authoritative reference** for connecting the `bidmart-auth-fe` frontend to a real REST backend. It targets both the backend implementer and any agent wiring up live API calls in the frontend. Read this alongside `API-CONTRACT.md`, which defines the exact endpoint and payload contract.

---

## 1. Project Architecture Overview

### Stack

- **Framework**: React Router v7 (SSR-capable, file-based routing via `app/routes/`)
- **HTTP Client**: custom `apiClient` wrapper over native `fetch` (`app/shared/infrastructure/http/api-client.ts`)
- **Schema validation**: Zod — every API response is parsed at the infrastructure boundary before entering the domain
- **State**: no global store; auth user stored in a module-level singleton (`getCurrentUser()` / `setCurrentUser()`) and persisted server-side via httpOnly cookie
- **Architecture**: Clean Architecture — Domain → Application (use cases) → Infrastructure (repositories) → Presentation (pages/components)

### Module Layout

```
app/
  modules/
    auth/
      application/    use cases + DTOs
      domain/         entities + errors + repository interface
      infrastructure/ AuthApiRepository, Zod schemas, mapper
      presentation/   pages + components
    settings/
      application/    use cases + DTOs
      domain/         entities + errors + repository interface
      infrastructure/ SettingsApiRepository, Zod schemas, mapper
      presentation/   pages + components
  shared/
    infrastructure/
      http/           apiClient (fetch wrapper)
      auth/           session type, cookie parser
```

---

## 2. Environment Configuration

The **only** required environment variable is:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

- Defined in `app/shared/infrastructure/http/api-client.ts`
- Falls back to `""` (same-origin) if not set
- All API calls are prefixed with this value: e.g. `VITE_API_BASE_URL + "/auth/login"`

---

## 3. HTTP Client Behaviour

All requests go through `apiClient` (`app/shared/infrastructure/http/api-client.ts`). Key behaviours the backend must be compatible with:

| Behaviour                        | Detail                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `credentials: "include"`         | Every request sends cookies automatically — **backend must allow credentials in CORS** |
| `Content-Type: application/json` | All request bodies are JSON                                                            |
| `Accept: application/json`       | Always set                                                                             |
| 204 No Content                   | Handled — returns `undefined`, no body parsing                                         |
| Error parsing                    | Non-2xx responses are parsed as `{ message?, errors? }` JSON before throwing           |

### CORS Requirements (Backend)

The backend **must** respond with:

```
Access-Control-Allow-Origin: <frontend-origin>   (not wildcard — credentials require explicit origin)
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

### Error Response Format

All non-2xx responses must return JSON. The client reads `body.message` and `body.errors`:

```json
{
  "message": "Human-readable description",
  "code": "OPTIONAL_MACHINE_CODE",
  "errors": {
    "fieldName": ["validation message"]
  }
}
```

### Status Code → Domain Error Mapping

| HTTP Status | Thrown As                          | Used In                                         |
| ----------- | ---------------------------------- | ----------------------------------------------- |
| 400         | `NetworkError(message, 400)`       | reset-password invalid token, MFA invalid code  |
| 401         | `NetworkError(message, 401)`       | invalid password (change password, disable MFA) |
| 404         | `NotFoundError`                    | session not found                               |
| 410         | `GoneError`                        | reset token expired, MFA ticket expired         |
| 422         | `ValidationError(message, errors)` | field-level validation failures                 |

---

## 4. Session & Authentication Model

### How auth state is persisted

The frontend uses a **dual-layer approach**:

1. **In-memory** (`getCurrentUser()` in `auth-repository.factory.ts`): holds the `UserDTO` for the current browser session. Cleared on logout or page refresh.
2. **httpOnly cookie** (`auth_session`): a base64-encoded JSON value set by the backend. The frontend reads this server-side to hydrate SSR routes. Shape:

```ts
type AuthSession = {
  userId: string;
  email: string;
  accessToken: string;
  expiresAt: number; // Unix ms timestamp
};
```

### What the backend must set on login/MFA verify

On a successful login (or MFA verification), the backend must:

1. Return `{ user, accessToken }` in the JSON body (as defined in API-CONTRACT.md)
2. **Set an `auth_session` httpOnly cookie** containing the session JSON, base64-encoded:
   ```
   Set-Cookie: auth_session=<base64(JSON)>; HttpOnly; SameSite=Lax; Path=/
   ```
   The frontend's `cookie-utils.ts` decodes `atob(cookieValue)` and parses as `AuthSession`.

### On logout

- Frontend calls `POST /auth/logout`
- Backend must **clear the `auth_session` cookie** by setting `Max-Age=0` or `Expires` in the past

---

## 5. Auth Module — Flow Reference

### 5.1 Login Flow

**Route**: `/login`  
**API**: `POST /auth/login`

```
User submits → POST /auth/login
  ├── requiresMfa: false → navigate("/posts")  [authenticated]
  └── requiresMfa: true  → navigate("/mfa", state: { ticket, mfaType })
                           → MfaPage redirects to /mfa/totp?ticket=... or /mfa/email?ticket=...
```

MFA ticket is passed as **React Router location state** from login → MFA page, then as a query param to the specific MFA page.

### 5.2 Registration Flow

**Route**: `/register`  
**API**: `POST /auth/register`

```
User submits → POST /auth/register → navigate("/check-email")
```

The `/check-email` page is a static info screen with a resend button.

### 5.3 Email Verification Flow

**Route**: `/verify-email?token=...` (auto-verifies on mount)  
**API**: `POST /auth/verify-email`

```
/verify-email?token=<token>
  → POST /auth/verify-email { token }
  ├── success → navigate("/verify-email/success")
  ├── 410 GoneError → navigate("/verify-email/expired")
  └── 400/invalid → navigate("/verify-email/invalid")
```

Result pages (`/verify-email/success`, `/verify-email/expired`, `/verify-email/invalid`) are static display screens.

The `/check-email` page has a resend button:  
**API**: `POST /auth/resend-verification` — `{ email: string }`

### 5.4 Password Reset Flow

**Route**: `/forgot-password` → `/forgot-password/sent` → `/reset-password?token=...`

```
POST /auth/forgot-password { email }
  → navigate("/forgot-password/sent")   [always, even if email not found — security]

/reset-password?token=<token>
  → POST /auth/reset-password { token, password }
  ├── success → navigate("/reset-password/success")
  ├── 410 GoneError → TokenExpiredError → navigate("/reset-password/expired")
  └── 400 → InvalidResetTokenError → navigate("/reset-password/invalid")
```

### 5.5 MFA Verification Flow (Auth)

**TOTP route** `/mfa/totp?ticket=<ticket>`  
**Email route** `/mfa/email?ticket=<ticket>`

```
TOTP: POST /auth/mfa/verify-totp { ticket, code }
  ├── success → navigate("/posts")
  ├── 410 GoneError → MfaExpiredError → navigate("/mfa/expired")
  └── invalid code → toast.error (inline, no redirect)

Email setup:
  POST /auth/mfa/send-email { ticket }   → sends code to user's email
  POST /auth/mfa/verify-email { ticket, code }
  ├── success → navigate("/posts")
  ├── 410 GoneError → MfaExpiredError → navigate("/mfa/expired")
  └── invalid code → toast.error (inline, no redirect)
```

The `MfaExpiredError` navigates to `/mfa/expired` — a static expiry screen.

---

## 6. Settings Module — Flow Reference

All settings routes require authentication. The backend must reject unauthenticated requests to `/settings/*` with **401**.

### 6.1 Profile

| Action | Method | Endpoint            | Request            | Response                         |
| ------ | ------ | ------------------- | ------------------ | -------------------------------- |
| Load   | GET    | `/settings/profile` | —                  | `{ user: UserProfile }`          |
| Save   | PUT    | `/settings/profile` | `UpdateProfileDTO` | `{ message, user: UserProfile }` |

`PUT` response must include the **updated user object** so the frontend can reset form state:

```ts
type UpdateProfileDTO = { name: string; address: string; postalCode: string };
```

### 6.2 Notifications

| Action | Method | Endpoint                  | Request                                             | Response                                   |
| ------ | ------ | ------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Load   | GET    | `/settings/notifications` | —                                                   | `{ preferences: NotificationPreferences }` |
| Save   | PUT    | `/settings/notifications` | `{ preferences: Partial<NotificationPreferences> }` | `{ message }`                              |

Note: the request body is **wrapped** under `preferences: { ... }`, not top-level fields.

### 6.3 Password Change

| Action | Method | Endpoint                      | Request                            | Response      |
| ------ | ------ | ----------------------------- | ---------------------------------- | ------------- |
| Change | POST   | `/settings/security/password` | `{ currentPassword, newPassword }` | `{ message }` |

On wrong `currentPassword` → **401** → `InvalidCurrentPasswordError` → `toast.error`.

### 6.4 Sessions

| Action     | Method | Endpoint                                 | Request | Response                  |
| ---------- | ------ | ---------------------------------------- | ------- | ------------------------- |
| List       | GET    | `/settings/security/sessions`            | —       | `{ sessions: Session[] }` |
| Revoke one | DELETE | `/settings/security/sessions/:sessionId` | —       | `{ message }`             |
| Revoke all | DELETE | `/settings/security/sessions`            | —       | `{ message }`             |

On revoke of non-existent session → **404** → `SessionNotFoundError`.

`Session` shape:

```ts
{
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string; // human-readable string, e.g. "Just now", "2 hours ago"
  isCurrent: boolean;
}
```

### 6.5 MFA (Settings)

#### Status

| Action     | Method | Endpoint                 | Response                                                      |
| ---------- | ------ | ------------------------ | ------------------------------------------------------------- |
| Get status | GET    | `/settings/security/mfa` | `{ mfaEnabled: boolean; mfaType: "totp" \| "email" \| null }` |

#### TOTP Setup

| Step        | Method | Endpoint                             | Request            | Response                                |
| ----------- | ------ | ------------------------------------ | ------------------ | --------------------------------------- |
| 1. Generate | POST   | `/settings/security/mfa/totp/setup`  | —                  | `{ qrCodeUrl: string; secret: string }` |
| 2. Verify   | POST   | `/settings/security/mfa/totp/verify` | `{ code: string }` | `{ message }`                           |

Note: Settings TOTP verify sends **only `{ code }`** — no `ticket`. This is different from the auth MFA verify which requires `{ ticket, code }`.

#### Email Setup

| Step         | Method | Endpoint                              | Request            | Response      |
| ------------ | ------ | ------------------------------------- | ------------------ | ------------- |
| 1. Send code | POST   | `/settings/security/mfa/email/setup`  | —                  | `{ message }` |
| 2. Verify    | POST   | `/settings/security/mfa/email/verify` | `{ code: string }` | `{ message }` |

Note: Settings Email verify sends **only `{ code }`** — no `ticket`.

On invalid code (either verify endpoint) → **400** → `InvalidMfaCodeError` → `toast.error`.

#### Disable MFA

| Action  | Method | Endpoint                         | Request                | Response      |
| ------- | ------ | -------------------------------- | ---------------------- | ------------- |
| Disable | POST   | `/settings/security/mfa/disable` | `{ password: string }` | `{ message }` |

On wrong password → **401** → `InvalidCurrentPasswordError`.

---

## 7. Zod Validation Schemas

The frontend validates all API responses at the infrastructure boundary using Zod. The backend output **must exactly match** these schemas or the frontend will throw a `ZodError`.

### Auth Schemas (`app/modules/auth/infrastructure/api/schemas.ts`)

```ts
userApiSchema          = { id, name, email, emailVerified: boolean }
loginSuccessApiSchema  = { requiresMfa?: false, user, accessToken }
mfaRequiredApiSchema   = { requiresMfa: true, ticket, mfaType: "totp"|"email" }
loginResponseApiSchema = union(mfaRequiredApiSchema, loginSuccessApiSchema)
registerApiSchema      = { user, message }
messageApiSchema       = { message }
mfaVerifyApiSchema     = { user, accessToken }
```

### Settings Schemas (`app/modules/settings/infrastructure/api/schemas.ts`)

```ts
getProfileApiSchema                  = { user: { id, name, email, address, postalCode } }
updateProfileApiSchema               = { message, user: { id, name, email, address, postalCode } }
getSessionsApiSchema                 = { sessions: Session[] }
messageApiSchema                     = { message }
getMfaStatusApiSchema                = { mfaEnabled: boolean, mfaType: "totp"|"email"|null }
setupMfaTotpApiSchema                = { qrCodeUrl, secret }
getNotificationPreferencesApiSchema  = { preferences: { emailNotifications, pushNotifications, marketingEmails, securityAlerts } }
```

---

## 8. Frontend Integration Checklist (for backend implementer)

Before marking the backend ready for integration, verify all of the following:

### Transport

- [ ] `VITE_API_BASE_URL` is set in `.env` pointing to the backend
- [ ] CORS allows the frontend origin with `credentials: true`
- [ ] All endpoints return `application/json`
- [ ] All error responses include a `message` field

### Auth Endpoints

- [ ] `POST /auth/login` returns the discriminated union (`requiresMfa` field always present)
- [ ] `POST /auth/login` (success) + `POST /auth/mfa/verify-*` (success) set the `auth_session` httpOnly cookie
- [ ] `POST /auth/logout` clears the `auth_session` cookie
- [ ] `POST /auth/register` returns `{ user, message }`
- [ ] `POST /auth/verify-email` returns 410 for expired tokens, 400 for invalid tokens
- [ ] `POST /auth/reset-password` returns 410 for expired tokens, 400 for invalid tokens
- [ ] `POST /auth/mfa/verify-totp` and `POST /auth/mfa/verify-email` accept `{ ticket, code }` and return 410 for expired tickets

### Settings Endpoints

- [ ] All `/settings/*` endpoints return 401 for unauthenticated requests
- [ ] `GET /settings/profile` returns `{ user: { id, name, email, address, postalCode } }`
- [ ] `PUT /settings/profile` returns `{ message, user }` (with updated user object)
- [ ] `GET /settings/notifications` returns `{ preferences: { ... } }` (wrapped)
- [ ] `PUT /settings/notifications` accepts `{ preferences: { ... } }` (wrapped)
- [ ] `DELETE /settings/security/sessions/:sessionId` returns 404 if session not found
- [ ] `POST /settings/security/password` returns 401 for wrong current password
- [ ] `POST /settings/security/mfa/totp/verify` accepts only `{ code }` (no ticket)
- [ ] `POST /settings/security/mfa/email/verify` accepts only `{ code }` (no ticket)
- [ ] `POST /settings/security/mfa/disable` returns 401 for wrong password
- [ ] `POST /settings/security/mfa/totp/setup` returns `{ qrCodeUrl, secret }`

---

## 9. Frontend Integration Checklist (for frontend agent)

When replacing mock implementations with real API calls:

### Phase 1 — Auth Module

- [ ] `LoginPage` — replace mock with `getAuthUseCases().login.execute(...)`, handle `MfaRequiredError` by navigating to `/mfa` with `state: { ticket, mfaType }`
- [ ] `RegisterPage` — replace mock with `getAuthUseCases().register.execute(...)`
- [ ] `VerifyEmailTokenPage` — replace token-sniffing logic with real `getAuthUseCases().verifyEmail.execute({ token })` call; error type determines redirect
- [ ] `CheckEmailPage` (resend) — replace mock with `getAuthUseCases().resendVerification.execute(...)`
- [ ] `ForgotPasswordPage` — replace mock with `getAuthUseCases().forgotPassword.execute(...)`
- [ ] `ResetPasswordPage` — replace mock with `getAuthUseCases().resetPassword.execute(...)`, handle `TokenExpiredError` and `InvalidResetTokenError`
- [ ] `MfaTotpPage` — replace mock with `getAuthUseCases().verifyMfaTotp.execute({ ticket, code })`, handle `MfaExpiredError`
- [ ] `MfaEmailPage` — replace mock with `getAuthUseCases().sendMfaEmail.execute({ ticket })` + `getAuthUseCases().verifyMfaEmail.execute({ ticket, code })`, handle `MfaExpiredError`
- [ ] On successful auth, call `setCurrentUser(user)` from the factory

### Phase 2 — Settings Module

- [ ] `ProfilePage` — replace mock with `getSettingsUseCases().getProfile.execute()` on load, `getSettingsUseCases().updateProfile.execute(values)` on submit; call `form.reset(updatedUser)` after save to hide sticky bar
- [ ] `NotificationsPage` — replace mock with `getSettingsUseCases().getNotificationPreferences.execute()` + `updateNotificationPreferences.execute(values)`; call `form.reset(values)` after save
- [ ] `ChangePasswordPage` — replace mock with `getSettingsUseCases().changePassword.execute(...)`
- [ ] `SessionsPage` — replace mock with `getSettingsUseCases().getSessions.execute()` on load + `revokeSession` / `revokeAllSessions`
- [ ] `MfaPage` (settings) — replace mock with `getSettingsUseCases().getMfaStatus.execute()` on load
- [ ] `MfaTotpSetupPage` — replace mock with `setupMfaTotp.execute()` + `verifyMfaTotp.execute({ code })`
- [ ] `MfaEmailSetupPage` — replace mock with `setupMfaEmail.execute()` + `verifyMfaEmail.execute({ code })`
- [ ] `MfaDisablePage` — replace mock with `disableMfa.execute({ password })`

---

## 10. API-CONTRACT.md Audit Notes

The following issues were identified during audit of `API-CONTRACT.md`:

### Corrections needed

1. **Section 2 — Status Code Semantics**: `401` (Unauthorized) is used by the backend but missing from the table. Add:

   > **401**: Invalid credentials or current password (login, change-password, disable-MFA).

2. **Section 3 — `POST /auth/register`**: The Zod schema (`registerApiSchema`) validates `{ user, message }` — not just `{ message }`. The endpoint table is correct but the section note "Returns user and success message" should be reflected in a payload example for clarity.

3. **Section 5 — DTO naming collision**: `VerifyMfaTotpDTO` and `VerifyMfaEmailDTO` appear in **both** the Auth DTOs and Settings DTOs sections but have **different shapes**:
   - Auth: `{ ticket: string; code: string }` — includes ticket (cross-session)
   - Settings: `{ code: string }` — no ticket (user is already authenticated)

   The current document shows both as the same type name. Rename the Settings variants to `SettingsVerifyMfaTotpDTO` and `SettingsVerifyMfaEmailDTO` to avoid confusion.

### Gaps to add

4. **Session cookie**: Document that successful login and MFA verification must set an `auth_session` httpOnly cookie (base64 JSON, `{ userId, email, accessToken, expiresAt }`). Logout must clear it.

5. **CORS**: Add a CORS section. The `apiClient` always sends `credentials: "include"` so the backend cannot use `Access-Control-Allow-Origin: *`.

6. **Environment**: Add a section noting `VITE_API_BASE_URL` is the required frontend env variable.

7. **`PUT /settings/notifications` request wrapper**: The table notes the body as `{ preferences: Partial<NotificationPreferences> }` but the examples section does not show this. The example already shows the wrapped body correctly — no change needed, but worth confirming in the checklist (already added above).
