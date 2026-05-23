import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/forgot-password/sent");
}

export default function ForgotPasswordSentRedirectRoute() {
  return null;
}
