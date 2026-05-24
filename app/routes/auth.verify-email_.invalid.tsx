import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailInvalidPage } from "~/modules/auth/presentation/pages/verify-email-invalid-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailInvalidRoute() {
  return <VerifyEmailInvalidPage />;
}
