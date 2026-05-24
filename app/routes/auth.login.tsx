import type { Route } from "./+types/auth.login";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { LoginPage } from "~/modules/auth/presentation/pages/login-page";

export const meta: Route.MetaFunction = () => [
  { title: "Login | BidMart" },
  { name: "description", content: "Sign in to your BidMart account to continue securely." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthLoginRoute() {
  return <LoginPage />;
}
