import { Outlet } from "react-router";
import { SettingsLayout } from "~/modules/settings/presentation/components/settings-layout";

export default function SettingsLayoutRoute() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
}
