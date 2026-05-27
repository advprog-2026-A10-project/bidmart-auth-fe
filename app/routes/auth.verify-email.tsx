import type { Route } from "./+types/auth.verify-email";
import { VerifyEmailTokenPage } from "~/modules/auth/presentation/pages/verify-email-token-page";

export const meta: Route.MetaFunction = () => [
  { title: "Verify Email | BidMart" },
  { name: "description", content: "Verify your email address to secure and activate your BidMart account." },
];

export default function AuthVerifyEmailRoute() {
  return <VerifyEmailTokenPage />;
}
