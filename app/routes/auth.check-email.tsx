import type { Route } from "./+types/auth.check-email";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { CheckEmailPage } from "~/modules/auth/presentation/pages/check-email-page";

export const meta: Route.MetaFunction = () => [
  { title: "Check Your Email | BidMart" },
  { name: "description", content: "Check your inbox for the next step to continue your BidMart authentication flow." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthCheckEmailRoute() {
  return <CheckEmailPage />;
}
