import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { DisableMfaDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useDisableMfaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: DisableMfaDTO) => getSettingsUseCases().disableMfa.execute(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings", "mfa"] });
      toast.success("MFA disabled.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable MFA.");
    },
  });
}
