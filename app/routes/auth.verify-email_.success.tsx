import type { Route } from "./+types/auth.verify-email_.success";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailSuccessPage } from "~/modules/auth/presentation/pages/verify-email-success-page";

export const meta: Route.MetaFunction = () => [
  { title: "Email Verified | BidMart" },
  { name: "description", content: "Your email has been verified successfully. You can continue to BidMart securely." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailSuccessRoute() {
  return <VerifyEmailSuccessPage />;
}
