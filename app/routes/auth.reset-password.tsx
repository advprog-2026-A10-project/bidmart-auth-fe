import type { Route } from "./+types/auth.reset-password";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordPage } from "~/modules/auth/presentation/pages/reset-password-page";

export const meta: Route.MetaFunction = () => [
  { title: "Reset Password | BidMart" },
  { name: "description", content: "Set a new password for your BidMart account using your reset token." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordRoute() {
  return <ResetPasswordPage />;
}
