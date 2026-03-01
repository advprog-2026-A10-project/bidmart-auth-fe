import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { MfaStatus } from "~/modules/settings/domain/entities/mfa-status.entity";

export class GetMfaStatusUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<MfaStatus> {
    return this.settingsRepository.getMfaStatus();
  }
}
