import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordSuccessPage } from "~/modules/auth/presentation/pages/reset-password-success-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordSuccessRoute() {
  return <ResetPasswordSuccessPage />;
}
