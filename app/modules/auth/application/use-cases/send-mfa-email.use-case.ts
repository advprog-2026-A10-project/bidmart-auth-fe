import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { SendMfaEmailDTO } from "../dtos/auth.dto";

/**
 * SendMfaEmailUseCase — Triggers sending an MFA code to the user's email.
 */
export class SendMfaEmailUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: SendMfaEmailDTO): Promise<{ message: string }> {
    return this.authRepository.sendMfaEmail({ ticket: dto.ticket });
  }
}
