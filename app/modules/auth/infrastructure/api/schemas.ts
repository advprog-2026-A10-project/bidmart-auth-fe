import { z } from "zod";

/**
 * Zod schemas for validating raw API responses at the infrastructure boundary.
 * All API responses are validated here — never in use cases or domain (DIP).
 */

export const userApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
});

export const loginApiSchema = z.object({
  user: userApiSchema,
  accessToken: z.string(),
});

export const registerApiSchema = z.object({
  user: userApiSchema,
  message: z.string(),
});

export const messageApiSchema = z.object({
  message: z.string(),
});

export type UserApiResponse = z.infer<typeof userApiSchema>;
export type LoginApiResponse = z.infer<typeof loginApiSchema>;
export type RegisterApiResponse = z.infer<typeof registerApiSchema>;
export type MessageApiResponse = z.infer<typeof messageApiSchema>;

// MFA-required response from login
export const mfaRequiredApiSchema = z.object({
  requiresMfa: z.literal(true),
  ticket: z.string(),
  mfaType: z.enum(["totp", "email"]),
});

// Normal login response (no MFA)
export const loginSuccessApiSchema = z.object({
  requiresMfa: z.literal(false).optional(),
  user: userApiSchema,
  accessToken: z.string(),
});

// Union: login can return either
export const loginResponseApiSchema = z.union([
  mfaRequiredApiSchema,
  loginSuccessApiSchema,
]);

// MFA verify response (totp or email)
export const mfaVerifyApiSchema = z.object({
  user: userApiSchema,
  accessToken: z.string(),
});

export type MfaRequiredApiResponse = z.infer<typeof mfaRequiredApiSchema>;
export type LoginSuccessApiResponse = z.infer<typeof loginSuccessApiSchema>;
export type LoginResponseApiResponse = z.infer<typeof loginResponseApiSchema>;
export type MfaVerifyApiResponse = z.infer<typeof mfaVerifyApiSchema>;
