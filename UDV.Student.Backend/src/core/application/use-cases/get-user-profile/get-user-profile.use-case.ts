import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserExceptionCode } from "src/core/domain/enums/exception.enum";
import { IStorageProvider } from "src/core/domain/providers/storage.provider";
import { IUserRepository } from "src/core/domain/repositories/user.repository";
import { IGlobalConfiguration } from "src/shared/configuration/global.configuration";
import { UserNotFoundException } from "src/core/domain/exceptions/user-not-found.exception";
import { GetUserProfileRequestDto, GetUserProfileResponseDto } from "./get-user-profile.dto";

@Injectable()
export class GetUserProfileUseCase {
    private readonly _avatarUrlExpiresIn: number;

    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: IUserRepository,
        private readonly _storageProvider: IStorageProvider,
    ) {
        const { PRESIGNED_READ_URL_EXPIRE_TIME } =
            this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");

        this._avatarUrlExpiresIn = PRESIGNED_READ_URL_EXPIRE_TIME;
    }

    public async execute({ userId }: GetUserProfileRequestDto): Promise<GetUserProfileResponseDto> {
        const user = await this._userRepository.findById(userId);

        if (!user)
            throw new UserNotFoundException(UserExceptionCode.USER_NOT_FOUND, "User not found");

        const avatarUrl = user.avatar
            ? await this._storageProvider.generatePresignedReadUrl({ objectKey: user.avatar, expiresIn: this._avatarUrlExpiresIn })
            : null;

        return new GetUserProfileResponseDto(user.id, user.email, user.username, user.role, avatarUrl || null);
    }
}
