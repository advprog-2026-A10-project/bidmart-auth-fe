import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/forgot-password");
}

export default function ForgotPasswordRedirectRoute() {
  return null;
}
