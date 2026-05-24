import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { RegisterPage } from "~/modules/auth/presentation/pages/register-page";

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthRegisterRoute() {
  return <RegisterPage />;
}
