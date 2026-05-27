import type { Route } from "./+types/settings.security.mfa._index";
import { MfaPage } from "~/modules/settings/presentation/pages/mfa-page";

export const meta: Route.MetaFunction = () => [
  { title: "MFA Settings | BidMart" },
  { name: "description", content: "Manage and review your BidMart multi-factor authentication setup." },
];

export default function SettingsSecurityMfaIndexRoute() {
  return <MfaPage />;
}
