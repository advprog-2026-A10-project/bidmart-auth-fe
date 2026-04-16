import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/verify-email/success");
}

export default function VerifyEmailSuccessRedirectRoute() {
  return null;
}
