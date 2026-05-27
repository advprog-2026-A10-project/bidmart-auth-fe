import type { Route } from "./+types/auth.verify-email_.expired";
import { VerifyEmailExpiredPage } from "~/modules/auth/presentation/pages/verify-email-expired-page";

export const meta: Route.MetaFunction = () => [
  { title: "Verification Link Expired | BidMart" },
  { name: "description", content: "Your email verification link expired. Request a new verification email." },
];

export default function AuthVerifyEmailExpiredRoute() {
  return <VerifyEmailExpiredPage />;
}
