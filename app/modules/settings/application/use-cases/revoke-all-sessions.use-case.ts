import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";

export class RevokeAllSessionsUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<{ message: string }> {
    return this.settingsRepository.revokeAllSessions();
  }
}
