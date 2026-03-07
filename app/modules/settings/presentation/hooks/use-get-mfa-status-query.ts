import { useQuery } from "@tanstack/react-query";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useGetMfaStatusQuery() {
  return useQuery({
    queryKey: ["settings", "mfa"],
    queryFn: () => getSettingsUseCases().getMfaStatus.execute(),
  });
}
