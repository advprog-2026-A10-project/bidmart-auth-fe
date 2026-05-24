import type { Route } from "./+types/settings.security.sessions";
import { SessionsPage } from "~/modules/settings/presentation/pages/sessions-page";

export const meta: Route.MetaFunction = () => [
  { title: "Active Sessions | BidMart" },
  { name: "description", content: "Review and manage active sessions for your BidMart account." },
];

export default function SettingsSecuritySessionsRoute() {
  return <SessionsPage />;
}
