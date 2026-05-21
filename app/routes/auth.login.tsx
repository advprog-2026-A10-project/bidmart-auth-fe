import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { LoginPage } from "~/modules/auth/presentation/pages/login-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthLoginRoute() {
  return <LoginPage />;
}
