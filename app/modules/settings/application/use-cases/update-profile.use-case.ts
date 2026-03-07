import type { ISettingsRepository } from "~/modules/settings/domain/repositories/settings-repository.interface";
import type { UpdateProfileDTO } from "../dtos/settings.dto";
import type { UserProfileDTO } from "../dtos/user-profile.dto";

export class UpdateProfileUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(dto: UpdateProfileDTO): Promise<{ message: string; user: UserProfileDTO }> {
    const result = await this.settingsRepository.updateProfile(dto);
    return {
      message: result.message,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        address: result.user.address,
        postalCode: result.user.postalCode,
      },
    };
  }
}
