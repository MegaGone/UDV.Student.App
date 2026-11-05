import { UserModel } from "../models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";

export class UserMapper {
    public static toDomain(model: UserModel): UserEntity {
        return new UserEntity({
            id: model.id,
            email: model.email,
            username: model.username,
            passwordHash: model.passwordHash,
            isActive: model.isActive,
        });
    }

    public static toPersistence(entity: UserEntity): UserModel {
        return {
            id: entity.id,
            email: entity.email,
            username: entity.username,
            passwordHash: entity.passwordHash,
            isActive: entity.isActive,
        };
    }
}
