import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { ForgotPasswordDTO } from "../dtos/auth.dto";

/**
 * ForgotPasswordUseCase — Requests a password-reset email for the given address.
 */
export class ForgotPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    return this.authRepository.forgotPassword({ email: dto.email });
  }
}
