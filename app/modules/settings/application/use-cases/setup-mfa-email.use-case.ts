import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { SetupMfaEmailDTO } from "../dtos/settings.dto";

export class SetupMfaEmailUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: SetupMfaEmailDTO): Promise<{ message: string }> {
    return this.settingsRepository.setupMfaEmail(dto);
  }
}
