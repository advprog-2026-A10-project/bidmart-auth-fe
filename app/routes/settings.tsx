import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { SettingsLayout } from "~/modules/settings/presentation/components/settings-layout";
import { getAccessToken } from "~/shared/infrastructure/auth";

function resolveAuthValidateUrl(requestUrl: string): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  if (apiBaseUrl.trim().length > 0) {
    return new URL("/auth/validate", apiBaseUrl).toString();
  }
  return new URL("/auth/validate", requestUrl).toString();
}

export async function loader({ request }: LoaderFunctionArgs) {
  const requestedUrl = new URL(request.url);
  const loginRedirect = `/login?redirect=${encodeURIComponent(requestedUrl.toString())}`;
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
    if (response.ok) return null;
  } catch {
    // treat downstream validation failures as unauthenticated
  }

  throw redirect(loginRedirect);
}

export default function SettingsLayoutRoute() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
}
