import type { UserProfile } from "~/modules/settings/domain/entities/user-profile.entity";
import type { Session } from "~/modules/settings/domain/entities/session.entity";
import type { MfaStatus } from "~/modules/settings/domain/entities/mfa-status.entity";
import type { NotificationPreferences } from "~/modules/settings/domain/entities/notification-preferences.entity";
import type {
  UserProfileApiResponse,
  SessionApiResponse,
  MfaStatusApiResponse,
  NotificationPreferencesApiResponse,
} from "./schemas";

export class SettingsApiMapper {
  static toUserProfile(raw: UserProfileApiResponse): UserProfile {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      address: raw.address,
      postalCode: raw.postalCode,
    };
  }

  static toSession(raw: SessionApiResponse): Session {
    return {
      id: raw.id,
      device: raw.device,
      browser: raw.browser,
      os: raw.os,
      ip: raw.ip,
      location: raw.location,
      lastActive: raw.lastActive,
      isCurrent: raw.isCurrent,
    };
  }

  static toMfaStatus(raw: MfaStatusApiResponse): MfaStatus {
    return {
      mfaEnabled: raw.mfaEnabled,
      mfaType: raw.mfaType,
    };
  }

  static toNotificationPreferences(
    raw: NotificationPreferencesApiResponse,
  ): NotificationPreferences {
    return {
      emailNotifications: raw.emailNotifications,
      pushNotifications: raw.pushNotifications,
      marketingEmails: raw.marketingEmails,
      securityAlerts: raw.securityAlerts,
    };
  }
}
