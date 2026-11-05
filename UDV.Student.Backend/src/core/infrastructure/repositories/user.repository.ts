import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserModel } from "../models/user.model";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSchema } from "../schemas/user.schema";
import { UserMapper } from "../mappers/user.mapper";
import { UserEntity } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserSchema)
        private readonly _repository: Repository<UserModel>,
    ) { }

    public async store(user: UserEntity): Promise<void> {
        await this._repository.save(UserMapper.toPersistence(user));
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const model = await this._repository.findOne({ where: { email } });
        return model ? UserMapper.toDomain(model) : null;
    }
}
