import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { CheckEmailPage } from "~/modules/auth/presentation/pages/check-email-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthCheckEmailRoute() {
  return <CheckEmailPage />;
}
