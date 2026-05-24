import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkError } from "~/shared/domain/errors/network-error";
import { EmailNotVerifiedError, UserDisabledError } from "~/modules/auth/domain/errors/auth-errors";
import { clearAccessToken, getAccessToken, setAccessToken } from "~/shared/infrastructure/auth";
import { apiClient } from "~/shared/infrastructure/http/api-client";
import { createUser } from "~/modules/auth/domain/entities/user";
import { clearCurrentUser, getCurrentUser, setCurrentUser } from "../../current-user-state";
import { AuthApiRepository } from "../auth-api.repository";

vi.mock("~/shared/infrastructure/http/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

describe("AuthApiRepository logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
    clearCurrentUser();
  });

  it("clears local auth state even when the backend logout endpoint fails", async () => {
    setAccessToken("memory-token");
    setCurrentUser(
      createUser({
        id: "user-1",
        name: "Alice",
        email: "alice@example.com",
        emailVerified: true,
      }),
    );
    mockedApiClient.post.mockRejectedValue(new NetworkError("Not found", 404));

    await expect(new AuthApiRepository().logout()).resolves.toBeUndefined();

    expect(getAccessToken()).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });
});

describe("AuthApiRepository login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
    clearCurrentUser();
  });

  it("returns the MFA-required branch without throwing or setting auth state", async () => {
    mockedApiClient.post.mockResolvedValue({
      requiresMfa: true,
      ticket: "mfa-ticket-1",
      mfaType: "email",
    });

    await expect(
      new AuthApiRepository().login({
        email: "alice@example.com",
        password: "correct-password",
      }),
    ).resolves.toEqual({
      requiresMfa: true,
      ticket: "mfa-ticket-1",
      mfaType: "email",
    });

    expect(getAccessToken()).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });

  it("maps a 403 unverified-email login response to EmailNotVerifiedError", async () => {
    mockedApiClient.post.mockRejectedValue(
      new NetworkError("Email must be verified before login.", 403),
    );

    await expect(
      new AuthApiRepository().login({
        email: "alice@example.com",
        password: "correct-password",
      }),
    ).rejects.toBeInstanceOf(EmailNotVerifiedError);

    expect(getAccessToken()).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });

  it("maps a 403 disabled-user login response to UserDisabledError", async () => {
    mockedApiClient.post.mockRejectedValue(new NetworkError("User account is disabled.", 403));

    await expect(
      new AuthApiRepository().login({
        email: "disabled@example.com",
        password: "correct-password",
      }),
    ).rejects.toBeInstanceOf(UserDisabledError);

    expect(getAccessToken()).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });
});
