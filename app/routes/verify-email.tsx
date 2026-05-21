import { redirect, type LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  return redirect(`/auth/verify-email${requestUrl.search}`);
}

export default function VerifyEmailRedirectRoute() {
  return null;
}
