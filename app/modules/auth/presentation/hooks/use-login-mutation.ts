import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthUseCases, setCurrentUser } from "~/modules/auth/infrastructure/factories/auth-repository.factory";
import {
  EmailNotVerifiedError,
  MfaRequiredError,
} from "~/modules/auth/domain/errors/auth-errors";
import type { LoginDTO } from "~/modules/auth/application/dtos/auth.dto";
import type { UserDTO } from "~/modules/auth/application/dtos/user.dto";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (dto: LoginDTO): Promise<UserDTO> => getAuthUseCases().login.execute(dto),
    onSuccess: (user) => {
      setCurrentUser(user);
      toast.success("Logged in successfully.");
    },
    onError: (error: Error) => {
      // MfaRequiredError is not a real error — suppress the toast.
      // EmailNotVerifiedError is handled by redirecting to the check-email flow.
      if (error instanceof MfaRequiredError || error instanceof EmailNotVerifiedError) return;
      toast.error(error.message || "Failed to log in.");
    },
  });
}
