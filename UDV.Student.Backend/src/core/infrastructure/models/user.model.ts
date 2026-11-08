export interface UserModel {
    id?: string;
    email: string;
    username: string;
    isActive: boolean;
    passwordHash: string;
    avatar?: string | null;
}
