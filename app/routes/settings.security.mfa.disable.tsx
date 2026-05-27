import type { Route } from "./+types/settings.security.mfa.disable";
import { MfaDisablePage } from "~/modules/settings/presentation/pages/mfa-disable-page";

export const meta: Route.MetaFunction = () => [
  { title: "Disable MFA | BidMart" },
  { name: "description", content: "Disable multi-factor authentication for your BidMart account if needed." },
];

export default function SettingsSecurityMfaDisableRoute() {
  return <MfaDisablePage />;
}
