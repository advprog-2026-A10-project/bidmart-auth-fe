import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { RevokeSessionDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RevokeSessionDTO) => getSettingsUseCases().revokeSession.execute(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings", "sessions"] });
      toast.success("Session revoked.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to revoke session.");
    },
  });
}
