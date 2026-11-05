export class AuthenticateUserRequestDto {
    email: string;
    password: string;
}

export class AuthenticateUserResponseDto {
    accessToken: string;
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
