export interface MfaStatus {
  mfaEnabled: boolean;
  mfaType: "totp" | "email" | null;
}
