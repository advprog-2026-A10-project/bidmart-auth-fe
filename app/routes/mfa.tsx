import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/mfa");
}

export default function MfaRedirectRoute() {
  return null;
}
