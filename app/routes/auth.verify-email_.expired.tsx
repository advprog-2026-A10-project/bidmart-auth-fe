import type { Route } from "./+types/auth.verify-email_.expired";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailExpiredPage } from "~/modules/auth/presentation/pages/verify-email-expired-page";

export const meta: Route.MetaFunction = () => [
  { title: "Verification Link Expired | BidMart" },
  { name: "description", content: "Your email verification link expired. Request a new verification email." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailExpiredRoute() {
  return <VerifyEmailExpiredPage />;
}
