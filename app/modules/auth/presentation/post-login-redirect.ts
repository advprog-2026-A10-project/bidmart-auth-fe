const DEFAULT_POST_LOGIN_PATH = "/settings/profile";

export function postLoginRedirectPath(): string {
  const configured = import.meta.env.VITE_AUTH_SUCCESS_REDIRECT_PATH;
  if (typeof configured !== "string" || configured.trim() === "") {
    return DEFAULT_POST_LOGIN_PATH;
  }

  const path = configured.trim();
  return path.startsWith("/") ? path : DEFAULT_POST_LOGIN_PATH;
}
