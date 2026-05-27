import type { Route } from "./+types/settings._index";
import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => [
  { title: "Settings | BidMart" },
  { name: "description", content: "Manage your BidMart account settings and profile preferences." },
];

export async function loader() {
  return redirect("/settings/profile");
}

export default function SettingsIndexRoute() {
  return null;
}
