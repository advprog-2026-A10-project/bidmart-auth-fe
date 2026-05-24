import type { Route } from "./+types/auth.verify-email_.invalid";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { VerifyEmailInvalidPage } from "~/modules/auth/presentation/pages/verify-email-invalid-page";

export const meta: Route.MetaFunction = () => [
  { title: "Invalid Verification Link | BidMart" },
  { name: "description", content: "The email verification link is invalid. Request another verification link." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthVerifyEmailInvalidRoute() {
  return <VerifyEmailInvalidPage />;
}
