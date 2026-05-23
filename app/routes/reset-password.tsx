import { redirect, type LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  return redirect(`/auth/reset-password${requestUrl.search}`);
}

export default function ResetPasswordRedirectRoute() {
  return null;
}
