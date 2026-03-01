import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import type { SendMfaEmailDTO } from "~/modules/auth/application/dtos/auth.dto";

export function useSendMfaEmailMutation() {
  return useMutation({
    mutationFn: (dto: SendMfaEmailDTO): Promise<{ message: string }> =>
      getAuthUseCases().sendMfaEmail.execute(dto),
    onSuccess: () => {
      toast.success("Code sent. Check your email.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send MFA code.");
    },
  });
}
