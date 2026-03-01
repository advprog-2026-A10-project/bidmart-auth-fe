import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { VerifyMfaTotpDTO } from "../dtos/settings.dto";

export class VerifyMfaTotpUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: VerifyMfaTotpDTO): Promise<{ message: string }> {
    return this.settingsRepository.verifyMfaTotp(dto);
  }
}
