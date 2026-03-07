import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { UpdateProfileDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (dto: UpdateProfileDTO) => getSettingsUseCases().updateProfile.execute(dto),
    onSuccess: () => {
      toast.success("Profile updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
}
