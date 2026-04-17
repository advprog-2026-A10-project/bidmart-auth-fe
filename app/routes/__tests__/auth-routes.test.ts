import { flatRoutes } from "@react-router/fs-routes";
import path from "node:path";
import { describe, expect, it } from "vitest";

function collectPaths(routes: Awaited<ReturnType<typeof flatRoutes>>, parent = ""): string[] {
  return routes.flatMap((route) => {
    const current = route.path ? [parent, route.path].filter(Boolean).join("/") : parent;
    return [
      current || undefined,
      ...collectPaths("children" in route && route.children ? route.children : [], current),
    ];
  }).filter((path): path is string => typeof path === "string");
}

describe("auth routes", () => {
  it("wires the required /auth routes", async () => {
    globalThis.__reactRouterAppDirectory = path.join(process.cwd(), "app");
    const routes = await flatRoutes();
    const paths = collectPaths(routes);

    expect(paths).toEqual(
      expect.arrayContaining([
        "register",
        "auth/check-email",
        "auth/verify-email",
        "auth/verify-email/success",
        "auth/verify-email/expired",
        "auth/verify-email/invalid",
        "login",
        "forgot-password",
        "forgot-password/sent",
        "reset-password",
        "reset-password/success",
        "reset-password/expired",
        "reset-password/invalid",
        "auth/mfa",
        "auth/mfa/offer",
        "auth/mfa/totp",
        "auth/mfa/email",
        "auth/mfa/expired",
        "settings/security/mfa",
        "settings/security/mfa/totp/setup",
        "settings/security/mfa/email/setup",
        "settings/security/mfa/disable",
      ]),
    );
  });
});
