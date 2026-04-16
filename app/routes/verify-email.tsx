import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/verify-email");
}

export default function VerifyEmailRedirectRoute() {
  return null;
}
