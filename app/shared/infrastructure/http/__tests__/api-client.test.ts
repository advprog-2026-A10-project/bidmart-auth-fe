import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAccessToken, setAccessToken } from "~/shared/infrastructure/auth";
import { apiClient } from "../api-client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAccessToken();
    document.cookie = "auth_session=; Max-Age=0; path=/";
    localStorage.clear();
    sessionStorage.clear();
  });

  it("uses same-origin credentials and attaches bearer token only from volatile memory", async () => {
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Response(JSON.stringify({ message: "ok" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const session = btoa(
      JSON.stringify({
        userId: "user-1",
        email: "alice@example.com",
        accessToken: "access-token-123",
        expiresAt: Date.now() + 60_000,
      }),
    );
    document.cookie = `auth_session=${session}; path=/`;
    localStorage.setItem("accessToken", "local-storage-token");
    sessionStorage.setItem("accessToken", "session-storage-token");

    await apiClient.get<{ message: string }>("/settings/security/mfa");

    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: "same-origin",
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );

    setAccessToken("memory-token-123");

    await apiClient.get<{ message: string }>("/settings/security/mfa");

    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: "same-origin",
        headers: expect.objectContaining({
          Authorization: "Bearer memory-token-123",
        }),
      }),
    );
  });
});
