import type { Route } from "./+types/settings.security.mfa.email.setup";
import MfaEmailSetupPage from "~/modules/settings/presentation/pages/mfa-email-setup-page";

export const meta: Route.MetaFunction = () => [
  { title: "Set Up Email MFA | BidMart" },
  { name: "description", content: "Enable email-based multi-factor authentication for your BidMart account." },
];

export default function SettingsSecurityMfaEmailSetupRoute() {
  return <MfaEmailSetupPage />;
}
