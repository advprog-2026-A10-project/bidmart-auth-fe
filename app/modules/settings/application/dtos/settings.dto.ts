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
  setupTicket: string;
  code: string;
  currentPassword: string;
};

export type SetupMfaTotpDTO = {
  currentPassword: string;
};

export type SetupMfaTotpResultDTO = {
  setupTicket: string;
  secret: string;
  otpauthUrl: string;
};

export type SetupMfaEmailDTO = {
  currentPassword: string;
};

export type VerifyMfaEmailDTO = {
  code: string;
  currentPassword: string;
};

export type DisableMfaDTO = {
  currentPassword: string;
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
