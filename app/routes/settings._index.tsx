import { redirect } from "react-router";

export async function loader() {
  return redirect("/settings/profile");
}

export default function SettingsIndexRoute() {
  return null;
}
