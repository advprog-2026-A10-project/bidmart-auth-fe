import type { Route } from "./+types/settings.security.mfa.totp.setup";
import MfaTotpSetupPage from "~/modules/settings/presentation/pages/mfa-totp-setup-page";

export const meta: Route.MetaFunction = () => [
  { title: "Set Up Authenticator App | BidMart" },
  { name: "description", content: "Scan the QR code and complete authenticator app setup for BidMart MFA." },
];

export default function SettingsSecurityMfaTotpSetupRoute() {
  return <MfaTotpSetupPage />;
}
