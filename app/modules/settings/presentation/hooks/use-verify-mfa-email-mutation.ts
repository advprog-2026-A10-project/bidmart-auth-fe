import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { VerifyMfaEmailDTO } from "~/modules/settings/application/dtos/settings.dto";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useVerifyMfaEmailMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: VerifyMfaEmailDTO) => getSettingsUseCases().verifyMfaEmail.execute(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings", "mfa"] });
      toast.success("Email MFA enabled.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid code. Please try again.");
    },
  });
}
