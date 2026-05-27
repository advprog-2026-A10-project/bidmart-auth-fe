import type { Route } from "./+types/settings.security";
import { Outlet } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "Security Settings | BidMart" },
  { name: "description", content: "Manage your BidMart account security settings and authentication options." },
];

export default function SettingsSecurityRoute() {
  return <Outlet />;
}
