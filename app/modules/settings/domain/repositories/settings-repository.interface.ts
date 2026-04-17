import type { UserProfile, Session, MfaStatus, NotificationPreferences } from "../entities";
import type {
  DisableMfaDTO,
  SetupMfaEmailDTO,
  SetupMfaTotpDTO,
  SetupMfaTotpResultDTO,
  VerifyMfaEmailDTO,
  VerifyMfaTotpDTO,
} from "~/modules/settings/application/dtos/settings.dto";

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
  setupMfaTotp(data: SetupMfaTotpDTO): Promise<SetupMfaTotpResultDTO>;
  verifyMfaTotp(data: VerifyMfaTotpDTO): Promise<{ message: string }>;
  setupMfaEmail(data: SetupMfaEmailDTO): Promise<{ message: string }>;
  verifyMfaEmail(data: VerifyMfaEmailDTO): Promise<{ message: string }>;
  disableMfa(data: DisableMfaDTO): Promise<{ message: string }>;
  getNotificationPreferences(): Promise<NotificationPreferences>;
  updateNotificationPreferences(
    data: Partial<NotificationPreferences>,
  ): Promise<{ message: string }>;
}
