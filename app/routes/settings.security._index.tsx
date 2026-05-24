import type { Route } from "./+types/settings.security._index";
import { SecurityPage } from "~/modules/settings/presentation/pages/security-page";

export const meta: Route.MetaFunction = () => [
  { title: "Security Settings | BidMart" },
  { name: "description", content: "Review and manage your BidMart account security options." },
];

export default function SettingsSecurityIndexRoute() {
  return <SecurityPage />;
}
