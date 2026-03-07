export type UpdateProfileDTO = {
  name: string;
  address: string;
  postalCode: string;
};

export type ChangePasswordDTO = {
  currentPassword: string;
  newPassword: string;
};

export type VerifyMfaTotpDTO = {
  code: string;
};

export type VerifyMfaEmailDTO = {
  code: string;
};

export type DisableMfaDTO = {
  password: string;
};

export type RevokeSessionDTO = {
  sessionId: string;
};

export type UpdateNotificationPreferencesDTO = {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
};
