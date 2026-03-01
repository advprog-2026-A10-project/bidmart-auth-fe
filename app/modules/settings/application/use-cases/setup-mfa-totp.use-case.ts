import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";

export class SetupMfaTotpUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<{ qrCodeUrl: string; secret: string }> {
    return this.settingsRepository.setupMfaTotp();
  }
}
