import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/core/domain/entities/user.entity";
import { UserExceptionCode } from "src/core/domain/enums/exception.enum";
import { ICryptoProvider } from "src/core/domain/providers/crypto.provider";
import { StoreUserRequestDto, StoreUserResponseDto } from "./store-user.dto";
import { IUserRepository } from "src/core/domain/repositories/user.repository";
import { UserAlreadyExistsException } from "src/core/domain/exceptions/user-already-exists.exception";

@Injectable()
export class StoreUserUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _cryptoProvider: ICryptoProvider,
    ) { }

    public async execute({ email, username, password }: StoreUserRequestDto): Promise<StoreUserResponseDto> {
        const existingUser = await this._userRepository.findByEmail(email);

        if (existingUser)
            throw new UserAlreadyExistsException(UserExceptionCode.USER_ALREADY_EXISTS, "Email already exists.");

        const passwordHash = await this._cryptoProvider.cipher(password);

        const user = new UserEntity({ email, username, passwordHash });

        await this._userRepository.store(user);

        return new StoreUserResponseDto(user.email, user.username);
    }
}
