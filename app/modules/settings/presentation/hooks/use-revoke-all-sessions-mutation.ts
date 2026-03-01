import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useRevokeAllSessionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getSettingsUseCases().revokeAllSessions.execute(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings", "sessions"] });
      toast.success("All sessions revoked.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to revoke all sessions.");
    },
  });
}
