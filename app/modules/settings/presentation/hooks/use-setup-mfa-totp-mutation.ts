import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetupMfaTotpDTO } from "~/modules/settings/application/dtos/settings.dto";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useSetupMfaTotpMutation() {
  return useMutation({
    mutationFn: (dto: SetupMfaTotpDTO) => getSettingsUseCases().setupMfaTotp.execute(dto),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start TOTP setup.");
    },
  });
}
