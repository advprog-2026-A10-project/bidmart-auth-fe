import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordExpiredPage } from "~/modules/auth/presentation/pages/reset-password-expired-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordExpiredRoute() {
  return <ResetPasswordExpiredPage />;
}
