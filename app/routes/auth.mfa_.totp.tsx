import type { Route } from "./+types/auth.mfa_.totp";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { MfaTotpPage } from "~/modules/auth/presentation/pages/mfa-totp-page";

export const meta: Route.MetaFunction = () => [
  { title: "Authenticator App Code | BidMart" },
  { name: "description", content: "Enter the code from your authenticator app to continue sign-in on BidMart." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthMfaTotpRoute() {
  return <MfaTotpPage />;
}
