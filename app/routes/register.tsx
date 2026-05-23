import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/register");
}

export default function RegisterRedirectRoute() {
  return null;
}
