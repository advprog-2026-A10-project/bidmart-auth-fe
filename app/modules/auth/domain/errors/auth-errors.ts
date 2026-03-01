import { AppError } from "~/shared/domain/errors/app-error";

/**
 * AuthError — base domain error for all authentication errors.
 * SRP: all auth domain errors extend this single base.
 */
export class AuthError extends AppError {
  constructor(message: string, code: string, statusCode?: number) {
    super(message, code, statusCode);
    this.name = "AuthError";
  }
}

/**
 * InvalidCredentialsError — thrown when email/password combination is wrong.
 */
export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    this.name = "InvalidCredentialsError";
  }
}

/**
 * EmailAlreadyExistsError — thrown when registering with an already-used email.
 */
export class EmailAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`Email "${email}" is already registered.`, "EMAIL_ALREADY_EXISTS", 409);
    this.name = "EmailAlreadyExistsError";
  }
}

/**
 * EmailNotVerifiedError — thrown when trying to login without verifying email.
 */
export class EmailNotVerifiedError extends AuthError {
  constructor() {
    super(
      "Email address has not been verified. Please check your inbox.",
      "EMAIL_NOT_VERIFIED",
      403,
    );
    this.name = "EmailNotVerifiedError";
  }
}

/**
 * InvalidVerificationTokenError — thrown when email verification token is invalid or expired.
 */
export class InvalidVerificationTokenError extends AuthError {
  constructor() {
    super(
      "Verification token is invalid or has expired.",
      "INVALID_VERIFICATION_TOKEN",
      400,
    );
    this.name = "InvalidVerificationTokenError";
  }
}

/**
 * TokenExpiredError — thrown when a reset-password or MFA token has expired (HTTP 410).
 */
export class TokenExpiredError extends AuthError {
  constructor(message = "This link has expired.") {
    super(message, "TOKEN_EXPIRED", 410);
    this.name = "TokenExpiredError";
  }
}

/**
 * InvalidResetTokenError — thrown when a reset-password token is invalid (HTTP 400).
 */
export class InvalidResetTokenError extends AuthError {
  constructor() {
    super("This password reset link is invalid.", "INVALID_RESET_TOKEN", 400);
    this.name = "InvalidResetTokenError";
  }
}

/**
 * MfaRequiredError — thrown by the login use-case when the backend requires MFA.
 * Carries the MFA ticket and method so the caller can redirect to the correct MFA route.
 */
export class MfaRequiredError extends AuthError {
  constructor(
    public readonly ticket: string,
    public readonly mfaType: "totp" | "email",
  ) {
    super("Multi-factor authentication is required.", "MFA_REQUIRED", 200);
    this.name = "MfaRequiredError";
  }
}

/**
 * MfaExpiredError — thrown when an MFA code or ticket has expired (HTTP 410).
 */
export class MfaExpiredError extends AuthError {
  constructor() {
    super("The MFA code has expired. Please try again.", "MFA_EXPIRED", 410);
    this.name = "MfaExpiredError";
  }
}
