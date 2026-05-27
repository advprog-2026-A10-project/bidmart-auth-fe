import type { Route } from "./+types/auth.reset-password_.success";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { ResetPasswordSuccessPage } from "~/modules/auth/presentation/pages/reset-password-success-page";

export const meta: Route.MetaFunction = () => [
  { title: "Password Reset Successful | BidMart" },
  { name: "description", content: "Your BidMart password has been updated successfully." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthResetPasswordSuccessRoute() {
  return <ResetPasswordSuccessPage />;
}
