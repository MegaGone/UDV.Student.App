import { UserEntity } from "../entities/user.entity";

export abstract class IUserRepository {
    public abstract store(user: UserEntity): Promise<void>;
    public abstract findByEmail(email: string): Promise<UserEntity | null>;
}