import type { Route } from "./+types/auth.forgot-password";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ForgotPasswordPage } from "~/modules/auth/presentation/pages/forgot-password-page";

export const meta: Route.MetaFunction = () => [
  { title: "Forgot Password | BidMart" },
  { name: "description", content: "Request a password reset link to regain access to your BidMart account." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
