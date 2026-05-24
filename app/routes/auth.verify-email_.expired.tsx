import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailExpiredPage } from "~/modules/auth/presentation/pages/verify-email-expired-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailExpiredRoute() {
  return <VerifyEmailExpiredPage />;
}
