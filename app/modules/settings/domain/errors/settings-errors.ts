import { AppError } from "~/shared/domain/errors/app-error";

/**
 * SettingsError — base domain error for all settings errors.
 * SRP: all settings domain errors extend this single base.
 */
export class SettingsError extends AppError {
  constructor(message: string, code: string, statusCode?: number) {
    super(message, code, statusCode);
    this.name = "SettingsError";
  }
}

/**
 * InvalidCurrentPasswordError — thrown when current password is wrong during change-password.
 */
export class InvalidCurrentPasswordError extends SettingsError {
  constructor() {
    super("Current password is incorrect.", "INVALID_CURRENT_PASSWORD", 401);
    this.name = "InvalidCurrentPasswordError";
  }
}

/**
 * SessionNotFoundError — thrown when trying to revoke a non-existent session.
 */
export class SessionNotFoundError extends SettingsError {
  constructor(sessionId: string) {
    super(`Session "${sessionId}" not found.`, "SESSION_NOT_FOUND", 404);
    this.name = "SessionNotFoundError";
  }
}

/**
 * MfaAlreadyEnabledError — thrown when trying to set up MFA when already enabled.
 */
export class MfaAlreadyEnabledError extends SettingsError {
  constructor() {
    super("Multi-factor authentication is already enabled.", "MFA_ALREADY_ENABLED", 409);
    this.name = "MfaAlreadyEnabledError";
  }
}

/**
 * MfaNotEnabledError — thrown when trying to disable MFA when not enabled.
 */
export class MfaNotEnabledError extends SettingsError {
  constructor() {
    super("Multi-factor authentication is not enabled.", "MFA_NOT_ENABLED", 400);
    this.name = "MfaNotEnabledError";
  }
}

/**
 * InvalidMfaCodeError — thrown when MFA setup verification code is wrong.
 */
export class InvalidMfaCodeError extends SettingsError {
  constructor() {
    super("Invalid MFA verification code.", "INVALID_MFA_CODE", 400);
    this.name = "InvalidMfaCodeError";
  }
}
