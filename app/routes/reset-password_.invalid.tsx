import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/reset-password/invalid");
}

export default function ResetPasswordInvalidRedirectRoute() {
  return null;
}
