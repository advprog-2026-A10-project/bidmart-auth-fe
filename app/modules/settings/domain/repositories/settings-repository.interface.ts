import type { UserProfile, Session, MfaStatus, NotificationPreferences } from "../entities";

export interface ISettingsRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: {
    name: string;
    address: string;
    postalCode: string;
  }): Promise<{ message: string; user: UserProfile }>;
  getSessions(): Promise<Session[]>;
  revokeSession(sessionId: string): Promise<{ message: string }>;
  revokeAllSessions(): Promise<{ message: string }>;
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }>;
  getMfaStatus(): Promise<MfaStatus>;
  setupMfaTotp(): Promise<{ qrCodeUrl: string; secret: string }>;
  verifyMfaTotp(data: { code: string }): Promise<{ message: string }>;
  setupMfaEmail(): Promise<{ message: string }>;
  verifyMfaEmail(data: { code: string }): Promise<{ message: string }>;
  disableMfa(data: { password: string }): Promise<{ message: string }>;
  getNotificationPreferences(): Promise<NotificationPreferences>;
  updateNotificationPreferences(
    data: Partial<NotificationPreferences>,
  ): Promise<{ message: string }>;
}
