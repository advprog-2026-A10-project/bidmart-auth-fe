import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettingsUseCases } from "~/modules/settings/infrastructure/factories/settings-repository.factory";
import type { UpdateNotificationPreferencesDTO } from "~/modules/settings/application/dtos/settings.dto";

export function useUpdateNotificationPreferencesMutation() {
  return useMutation({
    mutationFn: (dto: UpdateNotificationPreferencesDTO) =>
      getSettingsUseCases().updateNotificationPreferences.execute(dto),
    onSuccess: () => {
      toast.success("Notification preferences saved.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save preferences.");
    },
  });
}
