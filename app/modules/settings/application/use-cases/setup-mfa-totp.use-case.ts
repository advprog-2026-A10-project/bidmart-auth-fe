import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { SetupMfaTotpDTO, SetupMfaTotpResultDTO } from "../dtos/settings.dto";

export class SetupMfaTotpUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: SetupMfaTotpDTO): Promise<SetupMfaTotpResultDTO> {
    return this.settingsRepository.setupMfaTotp(dto);
  }
}
