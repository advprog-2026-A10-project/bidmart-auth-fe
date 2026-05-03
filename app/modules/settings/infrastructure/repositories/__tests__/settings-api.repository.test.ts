import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsApiRepository } from "../settings-api.repository";
import { apiClient } from "~/shared/infrastructure/http/api-client";

vi.mock("~/shared/infrastructure/http/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

describe("SettingsApiRepository MFA contract", () => {
  let repository: SettingsApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SettingsApiRepository();
  });

  it("parses MFA status from the settings panel contract", async () => {
    mockedApiClient.get.mockResolvedValue({
      mfaEnabled: true,
      mfaType: "email",
    });

    await expect(repository.getMfaStatus()).resolves.toEqual({
      mfaEnabled: true,
      mfaType: "email",
    });

    expect(mockedApiClient.get).toHaveBeenCalledWith("/settings/security/mfa");
  });

  it("parses TOTP setup response and sends current password", async () => {
    mockedApiClient.post.mockResolvedValue({
      setupTicket: "setup-ticket",
      secret: "SECRET",
      otpauthUrl: "otpauth://totp/BidMart:alice@example.com?secret=SECRET&issuer=BidMart",
      qrCodeUrl: "otpauth://totp/BidMart:alice@example.com?secret=SECRET&issuer=BidMart",
    });

    await expect(repository.setupMfaTotp({ currentPassword: "currentPass123" })).resolves.toEqual({
      setupTicket: "setup-ticket",
      secret: "SECRET",
      otpauthUrl: expect.stringContaining("otpauth://"),
      qrCodeUrl: expect.stringContaining("otpauth://"),
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/mfa/totp/setup", {
      currentPassword: "currentPass123",
    });
  });

  it("sends TOTP verify setup ticket, code, and current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "enabled" });

    await repository.verifyMfaTotp({
      setupTicket: "setup-ticket",
      code: "123456",
      currentPassword: "currentPass123",
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/mfa/totp/verify", {
      setupTicket: "setup-ticket",
      code: "123456",
      currentPassword: "currentPass123",
    });
  });

  it("sends email setup current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "sent" });

    await repository.setupMfaEmail({ currentPassword: "currentPass123" });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/mfa/email/setup", {
      currentPassword: "currentPass123",
    });
  });

  it("sends email verify code and current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "enabled" });

    await repository.verifyMfaEmail({
      code: "123456",
      currentPassword: "currentPass123",
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/mfa/email/verify", {
      code: "123456",
      currentPassword: "currentPass123",
    });
  });

  it("sends disable MFA current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "disabled" });

    await repository.disableMfa({ currentPassword: "currentPass123" });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/mfa/disable", {
      password: "currentPass123",
    });
  });
});

describe("SettingsApiRepository settings panel contract", () => {
  let repository: SettingsApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new SettingsApiRepository();
  });

  it("loads and updates the profile contract", async () => {
    mockedApiClient.get.mockResolvedValue({
      user: {
        id: "user-1",
        name: "Alice Buyer",
        email: "alice@example.com",
        address: "Jl. BidMart 1",
        postalCode: "12345",
      },
    });
    mockedApiClient.put.mockResolvedValue({
      message: "Profile updated.",
      user: {
        id: "user-1",
        name: "Alice Updated",
        email: "alice@example.com",
        address: "Jl. BidMart 2",
        postalCode: "54321",
      },
    });

    await expect(repository.getProfile()).resolves.toMatchObject({
      name: "Alice Buyer",
      postalCode: "12345",
    });
    await expect(
      repository.updateProfile({
        name: "Alice Updated",
        address: "Jl. BidMart 2",
        postalCode: "54321",
      }),
    ).resolves.toMatchObject({
      message: "Profile updated.",
      user: { name: "Alice Updated" },
    });

    expect(mockedApiClient.get).toHaveBeenCalledWith("/settings/profile");
    expect(mockedApiClient.put).toHaveBeenCalledWith("/settings/profile", {
      name: "Alice Updated",
      address: "Jl. BidMart 2",
      postalCode: "54321",
    });
  });

  it("loads and revokes active sessions", async () => {
    mockedApiClient.get.mockResolvedValue({
      sessions: [
        {
          id: "session-1",
          device: "Laptop",
          browser: "Chrome",
          os: "Windows",
          ip: "127.0.0.1",
          location: "Jakarta",
          lastActive: "2026-05-03T00:00:00Z",
          isCurrent: true,
        },
      ],
    });
    mockedApiClient.delete.mockResolvedValue({ message: "Session revoked." });

    await expect(repository.getSessions()).resolves.toHaveLength(1);
    await repository.revokeSession("session-1");
    await repository.revokeAllSessions();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/settings/security/sessions");
    expect(mockedApiClient.delete).toHaveBeenCalledWith("/settings/security/sessions/session-1");
    expect(mockedApiClient.delete).toHaveBeenCalledWith("/settings/security/sessions");
  });

  it("changes password and wraps notification preference updates", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "Password changed." });
    mockedApiClient.get.mockResolvedValue({
      preferences: {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
      },
    });
    mockedApiClient.put.mockResolvedValue({ message: "Preferences updated." });

    await repository.changePassword({
      currentPassword: "old-password",
      newPassword: "new-password",
    });
    await expect(repository.getNotificationPreferences()).resolves.toMatchObject({
      emailNotifications: true,
      securityAlerts: true,
    });
    await repository.updateNotificationPreferences({
      emailNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith("/settings/security/password", {
      currentPassword: "old-password",
      newPassword: "new-password",
    });
    expect(mockedApiClient.put).toHaveBeenCalledWith("/settings/notifications", {
      preferences: {
        emailNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      },
    });
  });
});
