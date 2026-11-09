import { UserModel } from "../models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";

export class UserMapper {
    public static toDomain(model: UserModel): UserEntity {
        return new UserEntity({
            id: model.id,
            role: model.role,
            email: model.email,
            avatar: model.avatar,
            isActive: model.isActive,
            username: model.username,
            passwordHash: model.passwordHash,
        });
    }

    public static toPersistence(entity: UserEntity): UserModel {
        return {
            id: entity.id,
            role: entity.role,
            email: entity.email,
            avatar: entity.avatar,
            isActive: entity.isActive,
            username: entity.username,
            passwordHash: entity.passwordHash,
        };
    }
}
