import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { MfaExpiredPage } from "~/modules/auth/presentation/pages/mfa-expired-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthMfaExpiredRoute() {
  return <MfaExpiredPage />;
}
