import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";

export class SetupMfaEmailUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<{ message: string }> {
    return this.settingsRepository.setupMfaEmail();
  }
}
