import type { Route } from "./+types/auth.verify-email";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailTokenPage } from "~/modules/auth/presentation/pages/verify-email-token-page";

export const meta: Route.MetaFunction = () => [
  { title: "Verify Email | BidMart" },
  { name: "description", content: "Verify your email address to secure and activate your BidMart account." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailRoute() {
  return <VerifyEmailTokenPage />;
}
