import type { Route } from "./+types/auth.mfa_.expired";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { MfaExpiredPage } from "~/modules/auth/presentation/pages/mfa-expired-page";

export const meta: Route.MetaFunction = () => [
  { title: "MFA Session Expired | BidMart" },
  { name: "description", content: "Your multi-factor authentication session expired. Restart sign-in to continue." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthMfaExpiredRoute() {
  return <MfaExpiredPage />;
}
