import { beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE_NAME } from "~/shared/infrastructure/auth";
import { apiClient } from "../api-client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.cookie = `${SESSION_COOKIE_NAME}=; Max-Age=0; path=/`;
  });

  it("keeps credentials included and attaches bearer token from AuthSession cookie", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
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
    document.cookie = `${SESSION_COOKIE_NAME}=${session}; path=/`;

    await apiClient.get<{ message: string }>("/settings/security/mfa");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          Authorization: "Bearer access-token-123",
        }),
      }),
    );
  });
});
