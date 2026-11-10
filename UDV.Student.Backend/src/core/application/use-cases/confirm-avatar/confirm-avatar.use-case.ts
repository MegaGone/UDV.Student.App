import { Injectable } from "@nestjs/common";
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
        if (!objectKey.startsWith(`${userId}/`))
            throw new MediaTypeNotAllowedException(MediaExceptionCode.INVALID_MEDIA_TYPE, "Object key does not belong to the user");

        const user = await this._userRepository.findById(userId);

        if (!user)
            throw new UserNotFoundException(UserExceptionCode.USER_NOT_FOUND, "User not found");

        const wasUploaded = await this._storageProvider.objectExists(objectKey);

        if (!wasUploaded)
            throw new MediaTypeUploadException(MediaExceptionCode.ERROR_UPLOADING_MEDIA, "Uploaded media not found");

        const previousAvatar = user.avatar;

        user.changeAvatar(objectKey);
        await this._userRepository.store(user);

        // Only after the new avatar is persisted, drop the previous object.
        if (previousAvatar && previousAvatar !== objectKey)
            await this._storageProvider.deleteObject(previousAvatar);

        return new ConfirmAvatarResponseDto(objectKey);
    }
}
