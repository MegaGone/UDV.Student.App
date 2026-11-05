import { Injectable } from "@nestjs/common";
import { UserExceptionCode } from "src/core/domain/enums/exception.enum";
import { ITokenProvider } from "src/core/domain/providers/token.provider";
import { ICryptoProvider } from "src/core/domain/providers/crypto.provider";
import { IUserRepository } from "src/core/domain/repositories/user.repository";
import { ISessionStore } from "src/core/domain/providers/session-store.provider";
import { UserInactiveException } from "src/core/domain/exceptions/user-inactive.exception";
import { AuthenticateUserRequestDto, AuthenticateUserResponseDto } from "./authenticate-user.dto";
import { InvalidCredentialsException } from "src/core/domain/exceptions/invalid-credentials.exception";

@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        private readonly _sessionStore: ISessionStore,
        private readonly _tokenProvider: ITokenProvider,
        private readonly _userRepository: IUserRepository,
        private readonly _cryptoProvider: ICryptoProvider,
    ) { }

    public async execute({ email, password }: AuthenticateUserRequestDto): Promise<AuthenticateUserResponseDto> {
        const user = await this._userRepository.findByEmail(email);

        if (!user)
            throw new InvalidCredentialsException(UserExceptionCode.INVALID_CREDENTIALS, "Email/Password are incorrect.");

        if (!user.isActive)
            throw new UserInactiveException(UserExceptionCode.USER_INACTIVE, "User inactive, please contact to the administrator.");

        const isValidPassword = await this._cryptoProvider.compare(password, user.passwordHash);

        if (!isValidPassword)
            throw new InvalidCredentialsException(UserExceptionCode.INVALID_CREDENTIALS, "Email/Password are incorrect.");

        const { accessToken, refreshToken, jti, refreshTtlSeconds } = await this._tokenProvider.generate({ id: user.id });

        const refreshHash = this._cryptoProvider.hash(refreshToken);
        await this._sessionStore.save(user.id, jti, refreshHash, refreshTtlSeconds);

        return new AuthenticateUserResponseDto(accessToken, refreshToken)
    }
}