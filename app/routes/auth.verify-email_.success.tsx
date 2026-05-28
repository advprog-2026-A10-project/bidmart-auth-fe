import type { Route } from "./+types/auth.verify-email_.success";
import { VerifyEmailSuccessPage } from "~/modules/auth/presentation/pages/verify-email-success-page";

export const meta: Route.MetaFunction = () => [
  { title: "Email Verified | BidMart" },
  { name: "description", content: "Your email has been verified successfully. You can continue to BidMart securely." },
];

export default function AuthVerifyEmailSuccessRoute() {
  return <VerifyEmailSuccessPage />;
}
