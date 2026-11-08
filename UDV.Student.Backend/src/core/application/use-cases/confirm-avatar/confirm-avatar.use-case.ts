import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/core/domain/entities/user.entity";
import { IStorageProvider } from "src/core/domain/providers/storage.provider";
import { IUserRepository } from "src/core/domain/repositories/user.repository";
import { ConfirmAvatarRequestDto, ConfirmAvatarResponseDto } from "./confirm-avatar.dto";
import { MediaExceptionCode, UserExceptionCode } from "src/core/domain/enums/exception.enum";
import { UserNotFoundException } from "src/core/domain/exceptions/user-not-found.exception";
import { MediaTypeUploadException } from "src/core/domain/exceptions/media-type-upload.exception";
import { MediaTypeNotAllowedException } from "src/core/domain/exceptions/media-type-not-allowed.exception";

@Injectable()
export class ConfirmAvatarUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _storageProvider: IStorageProvider,
    ) { }

    public async execute({ userId, objectKey }: ConfirmAvatarRequestDto): Promise<ConfirmAvatarResponseDto> {
        // The key is minted as `${userId}/...`; reject any key that is not the caller's
        // so a user cannot claim another user's (or an arbitrary) object.
        if (!objectKey.startsWith(`${userId}/`))
            throw new MediaTypeNotAllowedException(MediaExceptionCode.INVALID_MEDIA_TYPE, "Object key does not belong to the user");

        const user = await this._userRepository.findById(userId);

        if (!user)
            throw new UserNotFoundException(UserExceptionCode.USER_NOT_FOUND, "User not found");

        const wasUploaded = await this._storageProvider.objectExists(objectKey);

        if (!wasUploaded)
            throw new MediaTypeUploadException(MediaExceptionCode.ERROR_UPLOADING_MEDIA, "Uploaded media not found");

        const previousAvatar = user.avatar;

        await this._userRepository.store(new UserEntity({
            id: user.id,
            email: user.email,
            username: user.username,
            isActive: user.isActive,
            passwordHash: user.passwordHash,
            avatar: objectKey,
        }));

        // Only after the new avatar is persisted, drop the previous object.
        if (previousAvatar && previousAvatar !== objectKey)
            await this._storageProvider.deleteObject(previousAvatar);

        return new ConfirmAvatarResponseDto(objectKey);
    }
}
