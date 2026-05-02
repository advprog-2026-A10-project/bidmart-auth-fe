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

  it("parses MFA status from backend email/totp enabled flags", async () => {
    mockedApiClient.get.mockResolvedValue({
      emailEnabled: true,
      totpEnabled: false,
      mfaEnabled: true,
      mfaType: "email",
    });

    await expect(repository.getMfaStatus()).resolves.toEqual({
      emailEnabled: true,
      totpEnabled: false,
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

    await expect(
      repository.setupMfaTotp({ currentPassword: "currentPass123" }),
    ).resolves.toEqual({
      setupTicket: "setup-ticket",
      secret: "SECRET",
      otpauthUrl: expect.stringContaining("otpauth://"),
      qrCodeUrl: expect.stringContaining("otpauth://"),
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/settings/security/mfa/totp/setup",
      { currentPassword: "currentPass123" },
    );
  });

  it("sends TOTP verify setup ticket, code, and current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "enabled" });

    await repository.verifyMfaTotp({
      setupTicket: "setup-ticket",
      code: "123456",
      currentPassword: "currentPass123",
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/settings/security/mfa/totp/verify",
      {
        setupTicket: "setup-ticket",
        code: "123456",
        currentPassword: "currentPass123",
      },
    );
  });

  it("sends email setup current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "sent" });

    await repository.setupMfaEmail({ currentPassword: "currentPass123" });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/settings/security/mfa/email/setup",
      { currentPassword: "currentPass123" },
    );
  });

  it("sends email verify code and current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "enabled" });

    await repository.verifyMfaEmail({
      code: "123456",
      currentPassword: "currentPass123",
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/settings/security/mfa/email/verify",
      { code: "123456", currentPassword: "currentPass123" },
    );
  });

  it("sends disable MFA current password", async () => {
    mockedApiClient.post.mockResolvedValue({ message: "disabled" });

    await repository.disableMfa({ currentPassword: "currentPass123" });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/settings/security/mfa/disable",
      { currentPassword: "currentPass123" },
    );
  });
});
