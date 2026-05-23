import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/reset-password/success");
}

export default function ResetPasswordSuccessRedirectRoute() {
  return null;
}
