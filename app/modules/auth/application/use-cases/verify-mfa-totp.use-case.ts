import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { VerifyMfaTotpDTO } from "../dtos/auth.dto";
import type { UserDTO } from "../dtos/user.dto";

/**
 * VerifyMfaTotpUseCase — Verifies a TOTP code and returns the authenticated user.
 * Propagates MfaExpiredError from the repository on ticket expiry.
 */
export class VerifyMfaTotpUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: VerifyMfaTotpDTO): Promise<UserDTO> {
    const user = await this.authRepository.verifyMfaTotp({
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
