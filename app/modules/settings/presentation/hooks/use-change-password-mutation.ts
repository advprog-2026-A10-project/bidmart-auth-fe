import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { ChangePasswordDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDTO) => getSettingsUseCases().changePassword.execute(dto),
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
}
