import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { VerifyMfaEmailDTO } from "../dtos/auth.dto";
import type { UserDTO } from "../dtos/user.dto";

/**
 * VerifyMfaEmailUseCase — Verifies an email-based MFA code and returns the authenticated user.
 * Propagates MfaExpiredError from the repository on ticket expiry.
 */
export class VerifyMfaEmailUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: VerifyMfaEmailDTO): Promise<UserDTO> {
    const user = await this.authRepository.verifyMfaEmail({
      ticket: dto.ticket,
      code: dto.code,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}
