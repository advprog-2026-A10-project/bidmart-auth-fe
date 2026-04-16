import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/mfa/email");
}

export default function MfaEmailRedirectRoute() {
  return null;
}
