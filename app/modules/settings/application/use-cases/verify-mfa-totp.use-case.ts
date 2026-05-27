import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { VerifySetupMfaTotpDTO } from "../dtos/settings.dto";

export class VerifySetupMfaTotpUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: VerifySetupMfaTotpDTO): Promise<{ message: string }> {
    return this.settingsRepository.verifyMfaTotp(dto);
  }
}
