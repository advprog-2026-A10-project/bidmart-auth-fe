import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { VerifyMfaEmailDTO } from "../dtos/settings.dto";

export class VerifyMfaEmailUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: VerifyMfaEmailDTO): Promise<{ message: string }> {
    return this.settingsRepository.verifyMfaEmail(dto);
  }
}
