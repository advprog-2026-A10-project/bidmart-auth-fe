import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { UpdateNotificationPreferencesDTO } from "../dtos/settings.dto";

export class UpdateNotificationPreferencesUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: UpdateNotificationPreferencesDTO): Promise<{ message: string }> {
    return this.settingsRepository.updateNotificationPreferences(dto);
  }
}
