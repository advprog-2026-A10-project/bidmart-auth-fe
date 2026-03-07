import { useQuery } from "@tanstack/react-query";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { Session } from "~/modules/settings/domain/entities/session.entity";

export function useGetSessionsQuery() {
  return useQuery<Session[]>({
    queryKey: ["settings", "sessions"],
    queryFn: () => getSettingsUseCases().getSessions.execute(),
  });
}
