import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/mfa/totp");
}

export default function MfaTotpRedirectRoute() {
  return null;
}
