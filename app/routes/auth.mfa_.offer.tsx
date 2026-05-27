import type { Route } from "./+types/auth.mfa_.offer";
import { MfaOfferPage } from "~/modules/auth/presentation/pages/mfa-offer-page";

export const meta: Route.MetaFunction = () => [
  { title: "Set Up MFA | BidMart" },
  { name: "description", content: "Strengthen your BidMart account security by enabling multi-factor authentication." },
];

export default function AuthMfaOfferRoute() {
  return <MfaOfferPage />;
}
