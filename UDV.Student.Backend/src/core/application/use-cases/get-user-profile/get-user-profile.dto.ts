export class GetUserProfileRequestDto {
    userId: string;
}

export class GetUserProfileResponseDto {
    id: string;
    email: string;
    username: string;
    avatarUrl: string | null;

    constructor(id: string, email: string, username: string, avatarUrl: string | null) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }
}
