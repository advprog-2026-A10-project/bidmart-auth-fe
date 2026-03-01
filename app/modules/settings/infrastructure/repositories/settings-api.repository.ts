import { apiClient } from "~/shared/infrastructure/http/api-client";
import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { UserProfile } from "~/modules/settings/domain/entities/user-profile.entity";
import type { Session } from "~/modules/settings/domain/entities/session.entity";
import type { MfaStatus } from "~/modules/settings/domain/entities/mfa-status.entity";
import type { NotificationPreferences } from "~/modules/settings/domain/entities/notification-preferences.entity";
import {
  InvalidCurrentPasswordError,
  SessionNotFoundError,
  InvalidMfaCodeError,
} from "~/modules/settings/domain/errors/settings-errors";
import { NetworkError } from "~/shared/domain/errors/network-error";
import {
  getProfileApiSchema,
  updateProfileApiSchema,
  getSessionsApiSchema,
  messageApiSchema,
  getMfaStatusApiSchema,
  setupMfaTotpApiSchema,
  getNotificationPreferencesApiSchema,
} from "../api/schemas";
import { SettingsApiMapper } from "../api/settings-api.mapper";

export class SettingsApiRepository implements ISettingsRepository {
  private readonly basePath = "/settings";

  async getProfile(): Promise<UserProfile> {
    const raw = await apiClient.get<unknown>(`${this.basePath}/profile`);
    const validated = getProfileApiSchema.parse(raw);
    return SettingsApiMapper.toUserProfile(validated.user);
  }

  async updateProfile(data: {
    name: string;
    address: string;
    postalCode: string;
  }): Promise<{ message: string; user: UserProfile }> {
    const raw = await apiClient.put<unknown>(`${this.basePath}/profile`, data);
    const validated = updateProfileApiSchema.parse(raw);
    return {
      message: validated.message,
      user: SettingsApiMapper.toUserProfile(validated.user),
    };
  }

  async getSessions(): Promise<Session[]> {
    const raw = await apiClient.get<unknown>(`${this.basePath}/security/sessions`);
    const validated = getSessionsApiSchema.parse(raw);
    return validated.sessions.map(SettingsApiMapper.toSession);
  }

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    try {
      const raw = await apiClient.delete<unknown>(
        `${this.basePath}/security/sessions/${sessionId}`,
      );
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof NetworkError && error.statusCode === 404) {
        throw new SessionNotFoundError(sessionId);
      }
      throw error;
    }
  }

  async revokeAllSessions(): Promise<{ message: string }> {
    const raw = await apiClient.delete<unknown>(`${this.basePath}/security/sessions`);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/security/password`, data);
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof NetworkError && error.statusCode === 401) {
        throw new InvalidCurrentPasswordError();
      }
      throw error;
    }
  }

  async getMfaStatus(): Promise<MfaStatus> {
    const raw = await apiClient.get<unknown>(`${this.basePath}/security/mfa`);
    const validated = getMfaStatusApiSchema.parse(raw);
    return SettingsApiMapper.toMfaStatus(validated);
  }

  async setupMfaTotp(): Promise<{ qrCodeUrl: string; secret: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/security/mfa/totp/setup`);
    const validated = setupMfaTotpApiSchema.parse(raw);
    return { qrCodeUrl: validated.qrCodeUrl, secret: validated.secret };
  }

  async verifyMfaTotp(data: { code: string }): Promise<{ message: string }> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/security/mfa/totp/verify`, data);
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof NetworkError && error.statusCode === 400) {
        throw new InvalidMfaCodeError();
      }
      throw error;
    }
  }

  async setupMfaEmail(): Promise<{ message: string }> {
    const raw = await apiClient.post<unknown>(`${this.basePath}/security/mfa/email/setup`);
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }

  async verifyMfaEmail(data: { code: string }): Promise<{ message: string }> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/security/mfa/email/verify`, data);
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof NetworkError && error.statusCode === 400) {
        throw new InvalidMfaCodeError();
      }
      throw error;
    }
  }

  async disableMfa(data: { password: string }): Promise<{ message: string }> {
    try {
      const raw = await apiClient.post<unknown>(`${this.basePath}/security/mfa/disable`, data);
      const validated = messageApiSchema.parse(raw);
      return { message: validated.message };
    } catch (error) {
      if (error instanceof NetworkError && error.statusCode === 401) {
        throw new InvalidCurrentPasswordError();
      }
      throw error;
    }
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const raw = await apiClient.get<unknown>(`${this.basePath}/notifications`);
    const validated = getNotificationPreferencesApiSchema.parse(raw);
    return SettingsApiMapper.toNotificationPreferences(validated.preferences);
  }

  async updateNotificationPreferences(
    data: Partial<NotificationPreferences>,
  ): Promise<{ message: string }> {
    const raw = await apiClient.put<unknown>(`${this.basePath}/notifications`, {
      preferences: data,
    });
    const validated = messageApiSchema.parse(raw);
    return { message: validated.message };
  }
}
