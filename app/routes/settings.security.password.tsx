import type { Route } from "./+types/settings.security.password";
import { ChangePasswordPage } from "~/modules/settings/presentation/pages/change-password-page";

export const meta: Route.MetaFunction = () => [
  { title: "Change Password | BidMart" },
  { name: "description", content: "Change your BidMart account password to keep your account secure." },
];

export default function SettingsSecurityPasswordRoute() {
  return <ChangePasswordPage />;
}
