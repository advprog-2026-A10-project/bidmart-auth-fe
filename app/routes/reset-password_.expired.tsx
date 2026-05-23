import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/reset-password/expired");
}

export default function ResetPasswordExpiredRedirectRoute() {
  return null;
}
