import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import type { ResetPasswordDTO } from "~/modules/auth/application/dtos/auth.dto";
import {
  InvalidResetTokenError,
  TokenExpiredError,
  UserDisabledError,
} from "~/modules/auth/domain/errors/auth-errors";

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (dto: ResetPasswordDTO): Promise<{ message: string }> =>
      getAuthUseCases().resetPassword.execute(dto),
    onSuccess: (result) => {
      toast.success(result.message || "Password reset successful.");
    },
    onError: (error: Error) => {
      if (error instanceof TokenExpiredError || error instanceof InvalidResetTokenError) {
        toast.error(error.message);
        return;
      }
      if (error instanceof UserDisabledError) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message || "Failed to reset password.");
    },
  });
}
