import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/mfa/offer");
}

export default function MfaOfferRedirectRoute() {
  return null;
}
