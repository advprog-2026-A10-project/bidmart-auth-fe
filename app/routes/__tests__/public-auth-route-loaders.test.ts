import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LoaderFunctionArgs } from "react-router";
import { loader as indexLoader } from "../_index";
import { loader as authLoginLoader } from "../auth.login";

const { validateSessionMock } = vi.hoisted(() => ({
  validateSessionMock: vi.fn(),
}));

vi.mock("~/modules/auth/infrastructure/validate-session", () => ({
  validateSession: validateSessionMock,
}));

function buildLoaderArgs(url: string): LoaderFunctionArgs {
  return {
    request: new Request(url),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs;
}

describe("public auth route loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_REDIRECT_URL", "http://localhost:5174");
    vi.stubEnv(
      "VITE_ALLOWED_REDIRECT_ORIGINS",
      "http://localhost:5174,http://127.0.0.1:5174",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects authenticated /auth/login requests to the core app", async () => {
    validateSessionMock.mockResolvedValue(true);

    const response = (await authLoginLoader(
      buildLoaderArgs("http://localhost:5173/auth/login"),
    )) as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("http://localhost:5174/");
  });

  it("redirects authenticated /auth/login requests to an allowed redirect target", async () => {
    validateSessionMock.mockResolvedValue(true);

    const response = (await authLoginLoader(
      buildLoaderArgs("http://localhost:5173/auth/login?redirect=http%3A%2F%2Flocalhost%3A5174%2Fwallet"),
    )) as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("http://localhost:5174/wallet");
  });

  it("keeps /auth/login accessible when there is no valid session", async () => {
    validateSessionMock.mockResolvedValue(false);

    const response = await authLoginLoader(buildLoaderArgs("http://localhost:5173/auth/login"));

    expect(response).toBeNull();
  });

  it("redirects unauthenticated root requests to /auth/login and preserves query params", async () => {
    validateSessionMock.mockResolvedValue(false);

    const response = (await indexLoader(
      buildLoaderArgs("http://localhost:5173/?redirect=http%3A%2F%2Flocalhost%3A5174%2Forders"),
    )) as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "/auth/login?redirect=http%3A%2F%2Flocalhost%3A5174%2Forders",
    );
  });
});
