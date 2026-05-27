import type { Route } from "./+types/auth.forgot-password_.sent";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ForgotPasswordSentPage } from "~/modules/auth/presentation/pages/forgot-password-sent-page";

export const meta: Route.MetaFunction = () => [
  { title: "Password Reset Email Sent | BidMart" },
  { name: "description", content: "A password reset email has been sent if the account exists in BidMart." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthForgotPasswordSentRoute() {
  return <ForgotPasswordSentPage />;
}
