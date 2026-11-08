export class ConfirmAvatarRequestDto {
    userId: string;
    objectKey: string;
}

export class ConfirmAvatarResponseDto {
    avatar: string;

    constructor(avatar: string) {
        this.avatar = avatar;
    }
}
