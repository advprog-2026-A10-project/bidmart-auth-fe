import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { NotificationPreferences } from "~/modules/settings/domain/entities/notification-preferences.entity";

export class GetNotificationPreferencesUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<NotificationPreferences> {
    return this.settingsRepository.getNotificationPreferences();
  }
}
