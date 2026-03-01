// Hooks
export {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useChangePasswordMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useGetMfaStatusQuery,
  useSetupMfaTotpMutation,
  useVerifyMfaTotpMutation,
  useSetupMfaEmailMutation,
  useVerifyMfaEmailMutation,
  useDisableMfaMutation,
} from "./hooks/index";

// Components
export { SettingsLayout } from "./components/settings-layout";
export { ProfileForm } from "./components/profile-form";
export type { ProfileFormValues } from "./components/profile-form";
export { NotificationsForm } from "./components/notifications-form";
export type { NotificationsFormValues } from "./components/notifications-form";
export { ChangePasswordForm } from "./components/change-password-form";
export type { ChangePasswordFormValues } from "./components/change-password-form";
export { SessionCard } from "./components/session-card";
export { DisableMfaForm } from "./components/disable-mfa-form";
export type { DisableMfaFormValues } from "./components/disable-mfa-form";

// Pages
export { ProfilePage } from "./pages/profile-page";
export { SecurityPage } from "./pages/security-page";
export { ChangePasswordPage } from "./pages/change-password-page";
export { SessionsPage } from "./pages/sessions-page";
export { MfaDisablePage } from "./pages/mfa-disable-page";
export { NotificationsPage } from "./pages/notifications-page";
export { default as MfaPage } from "./pages/mfa-page";
export { default as MfaTotpSetupPage } from "./pages/mfa-totp-setup-page";
export { default as MfaEmailSetupPage } from "./pages/mfa-email-setup-page";
