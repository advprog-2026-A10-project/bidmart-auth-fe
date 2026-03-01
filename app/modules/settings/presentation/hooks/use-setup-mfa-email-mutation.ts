import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";

export function useSetupMfaEmailMutation() {
  return useMutation({
    mutationFn: () => getSettingsUseCases().setupMfaEmail.execute(),
    onSuccess: () => {
      toast.success("Verification email sent.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification email.");
    },
  });
}
