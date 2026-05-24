import type { Route } from "./+types/auth.register";
import type { LoaderFunctionArgs } from "react-router";
import { loadGuestOnlyAuthRequest } from "~/modules/auth/infrastructure/public-auth-route-loader";
import { RegisterPage } from "~/modules/auth/presentation/pages/register-page";

export const meta: Route.MetaFunction = () => [
  { title: "Create Account | BidMart" },
  { name: "description", content: "Create a new BidMart account to start using the platform." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return loadGuestOnlyAuthRequest(request);
}

export default function AuthRegisterRoute() {
  return <RegisterPage />;
}
