import type {
  ChangePasswordDTO,
  DisableMfaDTO,
  RevokeSessionDTO,
  UpdateNotificationPreferencesDTO,
  UpdateProfileDTO,
  VerifyMfaEmailDTO,
  VerifyMfaTotpDTO,
} from "~/modules/settings/application/dtos/settings.dto";
import type { UserProfileDTO } from "~/modules/settings/application/dtos/user-profile.dto";
import type { MfaStatus } from "~/modules/settings/domain/entities/mfa-status.entity";
import type { Session } from "~/modules/settings/domain/entities/session.entity";

type ActionSuccessResponse = { message: string };
type SetupMfaTotpResponse = { secret: string; qrCodeUrl: string };

export const SETTINGS_PAGE_MOCK_PAYLOADS = {
  profile: {
    response: {
      get: {
        id: "user-1",
        name: "Alice Johnson",
        email: "alice@example.com",
        address: "123 Main Street",
        postalCode: "10110",
      } satisfies UserProfileDTO,
      update: {
        message: "Profile updated successfully.",
      } satisfies ActionSuccessResponse,
    },
    request: {
      update: {
        name: "Alice Johnson",
        address: "123 Main Street",
        postalCode: "10110",
      } satisfies UpdateProfileDTO,
    },
  },
  notifications: {
    response: {
      get: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      } satisfies UpdateNotificationPreferencesDTO,
      update: {
        message: "Notification preferences saved.",
      } satisfies ActionSuccessResponse,
    },
    request: {
      update: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      } satisfies UpdateNotificationPreferencesDTO,
    },
  },
  sessions: {
    response: {
      get: [
        {
          id: "session-current",
          device: "MacBook Pro",
          browser: "Chrome",
          os: "macOS",
          ip: "203.0.113.10",
          location: "Bangkok, TH",
          lastActive: "Just now",
          isCurrent: true,
        },
        {
          id: "session-mobile",
          device: "iPhone 15",
          browser: "Safari",
          os: "iOS",
          ip: "203.0.113.44",
          location: "Bangkok, TH",
          lastActive: "2 hours ago",
          isCurrent: false,
        },
      ] satisfies Session[],
      revoke: {
        message: "Session revoked.",
      } satisfies ActionSuccessResponse,
      revokeAll: {
        message: "All sessions revoked.",
      } satisfies ActionSuccessResponse,
    },
    request: {
      revoke: {
        sessionId: "session-mobile",
      } satisfies RevokeSessionDTO,
    },
  },
  security: {
    response: {
      mfaStatus: {
        mfaEnabled: false,
        mfaType: null,
      } satisfies MfaStatus,
    },
  },
  changePassword: {
    request: {
      change: {
        currentPassword: "currentPass123",
        newPassword: "newPass123",
      } satisfies ChangePasswordDTO,
    },
    response: {
      success: {
        message: "Password changed successfully.",
      } satisfies ActionSuccessResponse,
    },
  },
  mfaEmail: {
    request: {
      verify: {
        code: "123456",
      } satisfies VerifyMfaEmailDTO,
    },
    response: {
      setup: {
        message: "Verification email sent.",
      } satisfies ActionSuccessResponse,
      verify: {
        message: "Email MFA enabled.",
      } satisfies ActionSuccessResponse,
    },
  },
  mfaTotp: {
    request: {
      verify: {
        code: "123456",
      } satisfies VerifyMfaTotpDTO,
    },
    response: {
      setup: {
        secret: "JBSWY3DPEHPK3PXP",
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=otpauth://totp/Bidmart:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Bidmart",
      } satisfies SetupMfaTotpResponse,
      verify: {
        message: "Authenticator app MFA enabled.",
      } satisfies ActionSuccessResponse,
    },
  },
  mfaDisable: {
    request: {
      disable: {
        password: "currentPass123",
      } satisfies DisableMfaDTO,
    },
    response: {
      success: {
        message: "MFA disabled.",
      } satisfies ActionSuccessResponse,
    },
  },
} as const;
