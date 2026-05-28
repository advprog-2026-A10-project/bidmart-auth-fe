import { useQuery } from "@tanstack/react-query";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { UserProfileDTO } from "~/modules/settings/application/dtos/user-profile.dto";

export function useGetProfileQuery() {
  return useQuery<UserProfileDTO>({
    queryKey: ["settings", "profile"],
    queryFn: () => getSettingsUseCases().getProfile.execute(),
  });
}
