import type { Route } from "./+types/settings.notifications";
import { NotificationsPage } from "~/modules/settings/presentation/pages/notifications-page";

export const meta: Route.MetaFunction = () => [
  { title: "Notification Settings | BidMart" },
  { name: "description", content: "Control notification preferences for your BidMart account." },
];

export default function SettingsNotificationsRoute() {
  return <NotificationsPage />;
}
