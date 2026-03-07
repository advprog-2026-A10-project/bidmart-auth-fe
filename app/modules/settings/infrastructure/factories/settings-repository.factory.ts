import { SettingsApiRepository } from "../repositories/settings-api.repository";
import { GetProfileUseCase } from "~/modules/settings/application/use-cases/get-profile.use-case";
import { UpdateProfileUseCase } from "~/modules/settings/application/use-cases/update-profile.use-case";
import { GetSessionsUseCase } from "~/modules/settings/application/use-cases/get-sessions.use-case";
import { RevokeSessionUseCase } from "~/modules/settings/application/use-cases/revoke-session.use-case";
import { RevokeAllSessionsUseCase } from "~/modules/settings/application/use-cases/revoke-all-sessions.use-case";
import { ChangePasswordUseCase } from "~/modules/settings/application/use-cases/change-password.use-case";
import { GetMfaStatusUseCase } from "~/modules/settings/application/use-cases/get-mfa-status.use-case";
import { SetupMfaTotpUseCase } from "~/modules/settings/application/use-cases/setup-mfa-totp.use-case";
import { VerifyMfaTotpUseCase } from "~/modules/settings/application/use-cases/verify-mfa-totp.use-case";
import { SetupMfaEmailUseCase } from "~/modules/settings/application/use-cases/setup-mfa-email.use-case";
import { VerifyMfaEmailUseCase } from "~/modules/settings/application/use-cases/verify-mfa-email.use-case";
import { DisableMfaUseCase } from "~/modules/settings/application/use-cases/disable-mfa.use-case";
import { GetNotificationPreferencesUseCase } from "~/modules/settings/application/use-cases/get-notification-preferences.use-case";
import { UpdateNotificationPreferencesUseCase } from "~/modules/settings/application/use-cases/update-notification-preferences.use-case";

export type SettingsUseCases = {
  getProfile: GetProfileUseCase;
  updateProfile: UpdateProfileUseCase;
  getSessions: GetSessionsUseCase;
  revokeSession: RevokeSessionUseCase;
  revokeAllSessions: RevokeAllSessionsUseCase;
  changePassword: ChangePasswordUseCase;
  getMfaStatus: GetMfaStatusUseCase;
  setupMfaTotp: SetupMfaTotpUseCase;
  verifyMfaTotp: VerifyMfaTotpUseCase;
  setupMfaEmail: SetupMfaEmailUseCase;
  verifyMfaEmail: VerifyMfaEmailUseCase;
  disableMfa: DisableMfaUseCase;
  getNotificationPreferences: GetNotificationPreferencesUseCase;
  updateNotificationPreferences: UpdateNotificationPreferencesUseCase;
};

export function createSettingsUseCases(): SettingsUseCases {
  const repository = new SettingsApiRepository();
  return {
    getProfile: new GetProfileUseCase(repository),
    updateProfile: new UpdateProfileUseCase(repository),
    getSessions: new GetSessionsUseCase(repository),
    revokeSession: new RevokeSessionUseCase(repository),
    revokeAllSessions: new RevokeAllSessionsUseCase(repository),
    changePassword: new ChangePasswordUseCase(repository),
    getMfaStatus: new GetMfaStatusUseCase(repository),
    setupMfaTotp: new SetupMfaTotpUseCase(repository),
    verifyMfaTotp: new VerifyMfaTotpUseCase(repository),
    setupMfaEmail: new SetupMfaEmailUseCase(repository),
    verifyMfaEmail: new VerifyMfaEmailUseCase(repository),
    disableMfa: new DisableMfaUseCase(repository),
    getNotificationPreferences: new GetNotificationPreferencesUseCase(repository),
    updateNotificationPreferences: new UpdateNotificationPreferencesUseCase(repository),
  };
}

let _settingsUseCases: SettingsUseCases | undefined;

export function getSettingsUseCases(): SettingsUseCases {
  if (!_settingsUseCases) {
    _settingsUseCases = createSettingsUseCases();
  }
  return _settingsUseCases;
}
