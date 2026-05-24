import type { Route } from "./+types/settings";
import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { SettingsLayout } from "~/modules/settings/presentation/components/settings-layout";
import { validateSession } from "~/modules/auth/infrastructure";

export const meta: Route.MetaFunction = () => [
  { title: "Settings | BidMart" },
  { name: "description", content: "Manage your BidMart account settings and security preferences." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  if (await validateSession(request)) return null;

  const requestedUrl = new URL(request.url);
  throw redirect(`/auth/login?redirect=${encodeURIComponent(requestedUrl.toString())}`);
}

export default function SettingsLayoutRoute() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
}
