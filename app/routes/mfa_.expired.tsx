import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/mfa/expired");
}

export default function MfaExpiredRedirectRoute() {
  return null;
}
