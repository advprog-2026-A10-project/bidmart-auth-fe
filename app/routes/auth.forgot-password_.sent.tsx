import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ForgotPasswordSentPage } from "~/modules/auth/presentation/pages/forgot-password-sent-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthForgotPasswordSentRoute() {
  return <ForgotPasswordSentPage />;
}
