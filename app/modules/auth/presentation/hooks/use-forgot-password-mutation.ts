import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import type { ForgotPasswordDTO } from "~/modules/auth/application/dtos/auth.dto";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordDTO): Promise<{ message: string }> =>
      getAuthUseCases().forgotPassword.execute(dto),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email.");
    },
  });
}
