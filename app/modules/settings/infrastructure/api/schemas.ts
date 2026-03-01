import { z } from "zod";

// --- Profile ---
export const userProfileApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  address: z.string(),
  postalCode: z.string(),
});

export const getProfileApiSchema = z.object({
  user: userProfileApiSchema,
});

export const updateProfileApiSchema = z.object({
  message: z.string(),
  user: userProfileApiSchema,
});

// --- Sessions ---
export const sessionApiSchema = z.object({
  id: z.string(),
  device: z.string(),
  browser: z.string(),
  os: z.string(),
  ip: z.string(),
  location: z.string(),
  lastActive: z.string(),
  isCurrent: z.boolean(),
});

export const getSessionsApiSchema = z.object({
  sessions: z.array(sessionApiSchema),
});

// --- Message (generic) ---
export const messageApiSchema = z.object({
  message: z.string(),
});

// --- MFA Status ---
export const mfaStatusApiSchema = z.object({
  mfaEnabled: z.boolean(),
  mfaType: z.enum(["totp", "email"]).nullable(),
});

export const getMfaStatusApiSchema = z.object({
  mfaEnabled: z.boolean(),
  mfaType: z.enum(["totp", "email"]).nullable(),
});

// --- MFA TOTP Setup ---
export const setupMfaTotpApiSchema = z.object({
  qrCodeUrl: z.string(),
  secret: z.string(),
});

// --- Notification Preferences ---
export const notificationPreferencesApiSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
});

export const getNotificationPreferencesApiSchema = z.object({
  preferences: notificationPreferencesApiSchema,
});

// --- Types ---
export type UserProfileApiResponse = z.infer<typeof userProfileApiSchema>;
export type SessionApiResponse = z.infer<typeof sessionApiSchema>;
export type MfaStatusApiResponse = z.infer<typeof mfaStatusApiSchema>;
export type SetupMfaTotpApiResponse = z.infer<typeof setupMfaTotpApiSchema>;
export type NotificationPreferencesApiResponse = z.infer<typeof notificationPreferencesApiSchema>;
