import { redirect, type LoaderFunctionArgs } from "react-router";
import { resolvePostAuthRedirect } from "~/modules/auth/infrastructure/navigation/redirect-target";
import { validateSession } from "./validate-session";

export async function loadGuestOnlyAuthRequest(request: Request): Promise<Response | null> {
  const requestUrl = new URL(request.url);
  if (await validateSession(request)) {
    return redirect(resolvePostAuthRedirect(requestUrl.searchParams.get("redirect")));
  }

  return null;
}

export async function loadAuthIndexRoute({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const guestOnlyResponse = await loadGuestOnlyAuthRequest(request);
  if (guestOnlyResponse) {
    return guestOnlyResponse;
  }

  const requestUrl = new URL(request.url);
  return redirect(`/auth/login${requestUrl.search}`);
}
