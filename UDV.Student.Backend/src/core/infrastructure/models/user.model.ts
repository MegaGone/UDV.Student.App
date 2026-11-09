import { UserRole } from "../../domain/enums/user-role.enum";

export interface UserModel {
    id?: string;
    email: string;
    role: UserRole;
    username: string;
    isActive: boolean;
    passwordHash: string;
    avatar?: string | null;
}
