import type { User } from "../entities/user";

export type MfaLoginResult =
  | { requiresMfa: false; user: User }
  | { requiresMfa: true; ticket: string; mfaType: "totp" | "email" };

/**
 * IAuthRepository — Repository Interface (Port)
 *
 * Defines the contract for auth data access. Use cases depend on this
 * abstraction, not on any concrete implementation (DIP).
 * ISP: focused interface — each method has a single, clear purpose.
 */
export interface IAuthRepository {
  login(credentials: { email: string; password: string }): Promise<MfaLoginResult>;
  register(data: { name: string; email: string; password: string }): Promise<{ message: string }>;
  verifyEmail(data: { token: string }): Promise<{ message: string }>;
  resendVerification(data: { email: string }): Promise<{ message: string }>;
  logout(): Promise<void>;
  forgotPassword(data: { email: string }): Promise<{ message: string }>;
  resetPassword(data: { token: string; password: string }): Promise<{ message: string }>;
  verifyMfaTotp(data: { ticket: string; code: string }): Promise<User>;
  sendMfaEmail(data: { ticket: string }): Promise<{ message: string }>;
  verifyMfaEmail(data: { ticket: string; code: string }): Promise<User>;
}
