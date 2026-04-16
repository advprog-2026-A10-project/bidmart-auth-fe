import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/verify-email/invalid");
}

export default function VerifyEmailInvalidRedirectRoute() {
  return null;
}
