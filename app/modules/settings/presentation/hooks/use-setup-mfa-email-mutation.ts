import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetupMfaEmailDTO } from "~/modules/settings/application/dtos/settings.dto";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useSetupMfaEmailMutation() {
  return useMutation({
    mutationFn: (dto: SetupMfaEmailDTO) => getSettingsUseCases().setupMfaEmail.execute(dto),
    onSuccess: () => {
      toast.success("MFA code sent.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send MFA code.");
    },
  });
}
