import type { Route } from "./+types/auth.mfa_.email";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { MfaEmailPage } from "~/modules/auth/presentation/pages/mfa-email-page";

export const meta: Route.MetaFunction = () => [
  { title: "Email Verification Code | BidMart" },
  { name: "description", content: "Enter the email verification code to complete BidMart sign-in." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthMfaEmailRoute() {
  return <MfaEmailPage />;
}
