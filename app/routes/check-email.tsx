import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/check-email");
}

export default function CheckEmailRedirectRoute() {
  return null;
}
