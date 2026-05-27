import { getAccessToken } from "~/shared/infrastructure/auth";

const VALIDATE_PATH = "/auth/validate";

function resolveAuthValidateUrl(requestUrl: string): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const base = apiBaseUrl.trim().length > 0 ? apiBaseUrl : requestUrl;
  return new URL(VALIDATE_PATH, base).toString();
}

export async function validateSession(request: Request): Promise<boolean> {
  const headers = new Headers({ Accept: "application/json" });
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  try {
    const response = await fetch(resolveAuthValidateUrl(request.url), {
      method: "POST",
      headers,
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
