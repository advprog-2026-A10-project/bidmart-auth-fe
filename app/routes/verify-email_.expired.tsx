import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/verify-email/expired");
}

export default function VerifyEmailExpiredRedirectRoute() {
  return null;
}
