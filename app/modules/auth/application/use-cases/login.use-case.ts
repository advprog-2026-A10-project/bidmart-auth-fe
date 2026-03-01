import type { IAuthRepository } from "~/modules/auth/domain/repositories/auth-repository.interface";
import type { LoginDTO } from "../dtos/auth.dto";
import type { UserDTO } from "../dtos/user.dto";
import { MfaRequiredError } from "~/modules/auth/domain/errors/auth-errors";

/**
 * LoginUseCase — Authenticates a user with email and password.
 *
 * Returns a UserDTO when login succeeds with no MFA.
 * Re-throws MfaRequiredError (with ticket + mfaType) when MFA is required,
 * so the presentation layer can redirect to the appropriate MFA route.
 */
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: LoginDTO): Promise<UserDTO> {
    const result = await this.authRepository.login({
      email: dto.email,
      password: dto.password,
    });

    if (result.requiresMfa) {
      // This is a typed signal — not an error in the traditional sense,
      // but throwing allows hooks to branch on it without changing return type.
      throw new MfaRequiredError(result.ticket, result.mfaType);
    }

    const user = result.user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}
