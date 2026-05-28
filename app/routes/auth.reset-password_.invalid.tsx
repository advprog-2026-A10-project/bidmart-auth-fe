import type { Route } from "./+types/auth.reset-password_.invalid";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordInvalidPage } from "~/modules/auth/presentation/pages/reset-password-invalid-page";

export const meta: Route.MetaFunction = () => [
  { title: "Invalid Reset Link | BidMart" },
  { name: "description", content: "The password reset link is invalid. Request a new password reset link." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordInvalidRoute() {
  return <ResetPasswordInvalidPage />;
}
