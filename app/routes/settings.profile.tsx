import type { Route } from "./+types/settings.profile";
import { ProfilePage } from "~/modules/settings/presentation/pages/profile-page";

export const meta: Route.MetaFunction = () => [
  { title: "Profile Settings | BidMart" },
  { name: "description", content: "Update your BidMart profile information and personal details." },
];

export default function SettingsProfileRoute() {
  return <ProfilePage />;
}
