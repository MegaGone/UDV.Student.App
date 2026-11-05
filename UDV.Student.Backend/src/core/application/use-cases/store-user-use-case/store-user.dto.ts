export class StoreUserRequestDto {
    email: string;
    username: string;
    password: string;
}

export class StoreUserResponseDto {
    email: string;
    username: string;

    constructor(email: string, username: string) {
        this.email = email;
        this.username = username;
    }
}
