import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { UserProfileDTO } from "../dtos/user-profile.dto";

export class GetProfileUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(): Promise<UserProfileDTO> {
    const profile = await this.settingsRepository.getProfile();
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      address: profile.address,
      postalCode: profile.postalCode,
    };
  }
}
