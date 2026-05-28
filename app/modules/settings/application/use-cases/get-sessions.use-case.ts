import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { Session } from "~/modules/settings/domain/entities/session.entity";

export class GetSessionsUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<Session[]> {
    return this.settingsRepository.getSessions();
  }
}
