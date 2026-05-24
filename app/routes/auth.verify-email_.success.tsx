import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailSuccessPage } from "~/modules/auth/presentation/pages/verify-email-success-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailSuccessRoute() {
  return <VerifyEmailSuccessPage />;
}
