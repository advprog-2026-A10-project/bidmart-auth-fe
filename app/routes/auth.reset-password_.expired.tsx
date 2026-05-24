import type { Route } from "./+types/auth.reset-password_.expired";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordExpiredPage } from "~/modules/auth/presentation/pages/reset-password-expired-page";

export const meta: Route.MetaFunction = () => [
  { title: "Reset Link Expired | BidMart" },
  { name: "description", content: "Your password reset link has expired. Request a new link to continue." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordExpiredRoute() {
  return <ResetPasswordExpiredPage />;
}
