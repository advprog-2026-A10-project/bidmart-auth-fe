import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { DisableMfaDTO } from "../dtos/settings.dto";

export class DisableMfaUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: DisableMfaDTO): Promise<{ message: string }> {
    return this.settingsRepository.disableMfa(dto);
  }
}
