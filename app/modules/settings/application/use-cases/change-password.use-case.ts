import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { ChangePasswordDTO } from "../dtos/settings.dto";

export class ChangePasswordUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {
    return this.settingsRepository.changePassword(dto);
  }
}
