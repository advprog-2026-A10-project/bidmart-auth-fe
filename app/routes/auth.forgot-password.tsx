import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ForgotPasswordPage } from "~/modules/auth/presentation/pages/forgot-password-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
