export class GetUserProfileRequestDto {
    userId: string;
}

export class GetUserProfileResponseDto {
    id: string;
    email: string;
    username: string;
    role: string;
    avatarUrl: string | null;

    constructor(id: string, email: string, username: string, role: string, avatarUrl: string | null) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }
}
