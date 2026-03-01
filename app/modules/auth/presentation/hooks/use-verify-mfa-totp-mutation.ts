import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAuthUseCases,
  setCurrentUser,
} from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import { MfaExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import type { VerifyMfaTotpDTO } from "~/modules/auth/application/dtos/auth.dto";
import type { UserDTO } from "~/modules/auth/application/dtos/user.dto";

export function useVerifyMfaTotpMutation() {
  return useMutation({
    mutationFn: (dto: VerifyMfaTotpDTO): Promise<UserDTO> =>
      getAuthUseCases().verifyMfaTotp.execute(dto),
    onSuccess: (user) => {
      setCurrentUser(user);
      toast.success("Logged in successfully.");
    },
    onError: (error: Error) => {
      if (error instanceof MfaExpiredError) return; // page handles redirect
      toast.error(error.message || "Invalid code. Please try again.");
    },
  });
}
