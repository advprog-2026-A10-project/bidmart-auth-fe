import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { VerifySetupMfaEmailDTO } from "../dtos/settings.dto";

export class VerifySetupMfaEmailUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: VerifySetupMfaEmailDTO): Promise<{ message: string }> {
    return this.settingsRepository.verifyMfaEmail(dto);
  }
}
