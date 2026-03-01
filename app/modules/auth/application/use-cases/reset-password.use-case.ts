import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { ResetPasswordDTO } from "../dtos/auth.dto";

/**
 * ResetPasswordUseCase — Resets a user's password using a one-time token.
 * Propagates TokenExpiredError or InvalidResetTokenError from the repository.
 */
export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordDTO): Promise<{ message: string }> {
    return this.authRepository.resetPassword({
      token: dto.token,
      password: dto.password,
    });
  }
}
