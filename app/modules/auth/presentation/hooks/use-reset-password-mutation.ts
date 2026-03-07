import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import type { ResetPasswordDTO } from "~/modules/auth/application/dtos/auth.dto";

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (dto: ResetPasswordDTO): Promise<{ message: string }> =>
      getAuthUseCases().resetPassword.execute(dto),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password.");
    },
  });
}
