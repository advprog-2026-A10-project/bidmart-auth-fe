import { apiClient } from "~/shared/infrastructure/http/api-client";
import { GoneError } from "~/shared/domain/errors/gone-error";
import type { User } from "~/modules/auth/domain/entities/user";
import type {
  IAuthRepository,
  MfaLoginResult,
} from "~/modules/auth/domain/repositories/auth-repository.interface";
import {
  MfaRequiredError,
  TokenExpiredError,
  InvalidResetTokenError,
  MfaExpiredError,
} from "~/modules/auth/domain/errors/auth-errors";
import {
  loginResponseApiSchema,
  messageApiSchema,
  mfaVerifyApiSchema,
  registerApiSchema,
} from "../api/schemas";
import { AuthApiMapper } from "../api/auth-api.mapper";

/**
 * AuthApiRepository — concrete implementation of IAuthRepository.
 *
 * LSP: fully substitutable for IAuthRepository everywhere it is used.
 * OCP: new data sources extend IAuthRepository without modifying use cases.
 *
 * All responses are validated against Zod schemas at this boundary (fail-fast).
 * Mock API payloads are used for new endpoints until backend is ready.
 */
export class AuthApiRepository implements IAuthRepository {
  private readonly basePath = "/auth";

  async login(credentials: { email: string; password: string }): Promise<MfaLoginResult> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/login`, credentials);
    const validated = loginResponseApiSchema.parse(raw);

    if (validated.requiresMfa === true) {
      // Throw a typed domain error so LoginUseCase can surface it to the hook
      throw new MfaRequiredError(validated.ticket, validated.mfaType);
    }

    const user = AuthApiMapper.toDomain(validated.user);
    return { requiresMfa: false, user };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/register`, data);
    const validated = registerApiSchema.parse(raw);
    return { message: validated.message };
  }

  async verifyEmail(data: { token: string }): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/verify-email`, data);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  async resendVerification(data: { email: string }): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/resend-verification`, data);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  async logout(): Promise<void> {
    await apiClient.post<void>(`${this.basePath}/logout`);
  }

  // ── Password reset ──────────────────────────────────────────────────────────

  /**
   * Mock contract: POST /auth/forgot-password
   * Body:    { email: string }
   * Success: { message: string }
   */
  async forgotPassword(data: { email: string }): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/forgot-password`, data);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  /**
   * Mock contract: POST /auth/reset-password
   * Body:    { token: string; password: string }
   * Success: { message: string }
   * 410:     GoneError  → re-thrown as TokenExpiredError
   * 400:     NetworkError (message: "invalid token") → re-thrown as InvalidResetTokenError
   */
  async resetPassword(data: { token: string; password: string }): Promise<{ message: string }> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/reset-password`, data);
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof GoneError) throw new TokenExpiredError();
      // Treat a 400-level network error with "invalid" in message as invalid token
      if (
        error instanceof Error &&
        "statusCode" in error &&
        (error as { statusCode?: number }).statusCode === 400
      ) {
        throw new InvalidResetTokenError();
      }
      throw error;
    }
  }

  // ── MFA ─────────────────────────────────────────────────────────────────────

  /**
   * Mock contract: POST /auth/mfa/verify-totp
   * Body:    { ticket: string; code: string }
   * Success: { user: UserApiResponse; accessToken: string }
   * 410:     GoneError → re-thrown as MfaExpiredError
   */
  async verifyMfaTotp(data: { ticket: string; code: string }): Promise<User> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/mfa/verify-totp`, data);
      const validated = mfaVerifyApiSchema.parse(raw);
      return AuthApiMapper.toDomain(validated.user);
    } catch (error) {
      if (error instanceof GoneError) throw new MfaExpiredError();
      throw error;
    }
  }

  /**
   * Mock contract: POST /auth/mfa/send-email
   * Body:    { ticket: string }
   * Success: { message: string }
   */
  async sendMfaEmail(data: { ticket: string }): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/mfa/send-email`, data);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  /**
   * Mock contract: POST /auth/mfa/verify-email
   * Body:    { ticket: string; code: string }
   * Success: { user: UserApiResponse; accessToken: string }
   * 410:     GoneError → re-thrown as MfaExpiredError
   */
  async verifyMfaEmail(data: { ticket: string; code: string }): Promise<User> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/mfa/verify-email`, data);
      const validated = mfaVerifyApiSchema.parse(raw);
      return AuthApiMapper.toDomain(validated.user);
    } catch (error) {
      if (error instanceof GoneError) throw new MfaExpiredError();
      throw error;
    }
  }
}
