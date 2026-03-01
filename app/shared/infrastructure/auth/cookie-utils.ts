import type { AuthSessionNullable } from "./session";

const SESSION_COOKIE_NAME = "auth_session";

/**
 * Parse the auth session from the request cookie header (server-side only).
 * The cookie is httpOnly so it cannot be read from the browser.
 */
export function parseSessionFromCookieHeader(cookieHeader: string | null): AuthSessionNullable {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...rest] = cookie.trim().split("=");
      return [key.trim(), rest.join("=")];
    }),
  );

  const sessionValue = cookies[SESSION_COOKIE_NAME];
  if (!sessionValue) return null;

  try {
    const decoded = JSON.parse(atob(sessionValue)) as AuthSessionNullable;
    if (!decoded || typeof decoded !== "object") return null;
    if (decoded.expiresAt < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
