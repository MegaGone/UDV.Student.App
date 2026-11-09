import { UserRole } from "src/core/domain/enums/user-role.enum";

export class StoreUserRequestDto {
    email: string;
    role?: UserRole;
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
