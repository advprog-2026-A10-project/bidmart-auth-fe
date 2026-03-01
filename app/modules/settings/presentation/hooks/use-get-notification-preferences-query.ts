import { useQuery } from "@tanstack/react-query";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { UpdateNotificationPreferencesDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useGetNotificationPreferencesQuery() {
  return useQuery<UpdateNotificationPreferencesDTO>({
    queryKey: ["settings", "notifications"],
    queryFn: () => getSettingsUseCases().getNotificationPreferences.execute(),
  });
}
