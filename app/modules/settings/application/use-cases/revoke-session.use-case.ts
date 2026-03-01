import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { RevokeSessionDTO } from "../dtos/settings.dto";

export class RevokeSessionUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: RevokeSessionDTO): Promise<{ message: string }> {
    return this.settingsRepository.revokeSession(dto.sessionId);
  }
}
