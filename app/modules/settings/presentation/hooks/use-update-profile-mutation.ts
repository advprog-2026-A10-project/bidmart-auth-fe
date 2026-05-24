import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { UpdateProfileDTO } from "~/modules/settings/application/dtos/settings.dto";
import type { UserProfileDTO } from "~/modules/settings/application/dtos/user-profile.dto";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDTO) => getSettingsUseCases().updateProfile.execute(dto),
    onSuccess: async (result) => {
      queryClient.setQueryData<UserProfileDTO>(["settings", "profile"], result.user);
      await queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
      toast.success("Profile updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
}
