import { describe, expect, it } from "vitest";
import type { LoaderFunctionArgs } from "react-router";
import { loader } from "../verify-email";

function buildLoaderArgs(url: string): LoaderFunctionArgs {
  return {
    request: new Request(url),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs;
}

describe("verify-email alias route loader", () => {
  it("preserves query params when redirecting to /auth/verify-email", () => {
    const response = loader(
      buildLoaderArgs("http://localhost:5173/verify-email?token=abc123&x=1"),
    ) as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/auth/verify-email?token=abc123&x=1");
  });
});
