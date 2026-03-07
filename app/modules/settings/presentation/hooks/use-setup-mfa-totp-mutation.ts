import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useSetupMfaTotpMutation() {
  return useMutation({
    mutationFn: () => getSettingsUseCases().setupMfaTotp.execute(),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start TOTP setup.");
    },
  });
}
