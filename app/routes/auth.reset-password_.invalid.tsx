import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordInvalidPage } from "~/modules/auth/presentation/pages/reset-password-invalid-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordInvalidRoute() {
  return <ResetPasswordInvalidPage />;
}
