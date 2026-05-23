import { redirect } from "react-router";

export function loader() {
  return redirect("/auth/login");
}

export default function LoginRedirectRoute() {
  return null;
}
