import type { Route } from "./+types/auth.mfa";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { MfaPage } from "~/modules/auth/presentation/pages/mfa-page";

export const meta: Route.MetaFunction = () => [
  { title: "Multi-Factor Authentication | BidMart" },
  { name: "description", content: "Complete your multi-factor authentication challenge to access BidMart." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthMfaRoute() {
  return <MfaPage />;
}
