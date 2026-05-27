import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import type { ForgotPasswordDTO } from "~/modules/auth/application/dtos/auth.dto";
import { UserDisabledError } from "~/modules/auth/domain/errors/auth-errors";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordDTO): Promise<{ message: string }> =>
      getAuthUseCases().forgotPassword.execute(dto),
    onSuccess: (result) => {
      toast.success(result.message || "If the account exists, a reset email has been sent.");
    },
    onError: (error: Error) => {
      if (error instanceof UserDisabledError) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message || "Failed to send reset email.");
    },
  });
}
