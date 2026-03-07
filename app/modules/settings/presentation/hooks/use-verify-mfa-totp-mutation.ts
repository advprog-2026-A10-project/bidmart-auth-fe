import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { VerifyMfaTotpDTO } from "~/modules/settings/application/dtos/settings.dto";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useVerifyMfaTotpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: VerifyMfaTotpDTO) => getSettingsUseCases().verifyMfaTotp.execute(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings", "mfa"] });
      toast.success("Authenticator app MFA enabled.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid code. Please try again.");
    },
  });
}
