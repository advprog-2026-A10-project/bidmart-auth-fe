# BidMart Auth FE Integration Guide

This guide describes how `bidmart-auth-fe` integrates with `bidmart-auth-be` in Iteration 1.

## 1) Session Model

- Hybrid browser auth is used:
  - `auth_session` httpOnly cookie is set by backend on successful login / MFA verification.
  - Access token is still returned in JSON and stored in volatile memory for compatibility.
- Frontend HTTP client uses `credentials: "include"` so cookie-based validation works.

## 2) Required Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_REDIRECT_URL=http://localhost:5174
VITE_ALLOWED_REDIRECT_ORIGINS=http://localhost:5174,http://localhost:5175
```

- `VITE_REDIRECT_URL`: fallback target after auth is complete.
- `VITE_ALLOWED_REDIRECT_ORIGINS`: CSV allowlist for `redirect` query parameter validation.

## 3) Auth Redirect Contract

- Login page accepts optional `redirect` query.
- `redirect` must be absolute `http(s)` and origin must match allowlist.
- Invalid/missing redirect falls back to `VITE_REDIRECT_URL`.
- Non-MFA users are routed to `/auth/mfa/offer` first.
- MFA users continue through `/auth/mfa/*` and then redirect to validated target.

## 4) Settings Guard

- `/settings/**` is protected by loader in `app/routes/settings.tsx`.
- Loader calls `POST /auth/validate`.
- On unauthorized session, user is redirected to `/login?redirect=<current-url>`.

## 5) Security Notes

- Do not persist tokens in `localStorage`/`sessionStorage`.
- MFA ticket storage (`bidmart:mfa-ticket`) is short-lived and contains only challenge ticket metadata.
- Treat `auth_session` as opaque and backend-managed.

