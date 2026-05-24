import type { Route } from "./+types/settings.security.mfa";
import { Outlet } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "MFA Settings | BidMart" },
  { name: "description", content: "Configure multi-factor authentication options for your BidMart account." },
];

export default function SettingsSecurityMfaRoute() {
  return <Outlet />;
}
