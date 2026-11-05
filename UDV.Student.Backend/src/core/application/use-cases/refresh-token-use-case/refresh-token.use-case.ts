import { Injectable } from "@nestjs/common";
import { UserExceptionCode } from "src/core/domain/enums/exception.enum";
import { ICryptoProvider } from "src/core/domain/providers/crypto.provider";
import { ISessionStore } from "src/core/domain/providers/session-store.provider";
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from "./refresh-token.dto";
import { ITokenProvider, IRefreshTokenPayload } from "src/core/domain/providers/token.provider";
import { InvalidCredentialsException } from "src/core/domain/exceptions/invalid-credentials.exception";

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private readonly _sessionStore: ISessionStore,
        private readonly _tokenProvider: ITokenProvider,
        private readonly _cryptoProvider: ICryptoProvider,
    ) { }

    public async execute({ refreshToken }: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        const { userId, jti } = await this.verify(refreshToken);

        const storedHash = await this._sessionStore.find(userId, jti);

        if (!storedHash || storedHash !== this._cryptoProvider.hash(refreshToken)) {
            await this._sessionStore.revokeAll(userId);
            throw new InvalidCredentialsException(UserExceptionCode.INVALID_CREDENTIALS, "Refresh token is no longer valid.");
        }

        await this._sessionStore.revoke(userId, jti);

        const tokens = await this._tokenProvider.generate({ id: userId });

        const refreshHash = this._cryptoProvider.hash(tokens.refreshToken);
        await this._sessionStore.save(userId, tokens.jti, refreshHash, tokens.refreshTtlSeconds);

        return new RefreshTokenResponseDto(tokens.accessToken, tokens.refreshToken);
    }

    private async verify(refreshToken: string): Promise<IRefreshTokenPayload> {
        try {
            return await this._tokenProvider.verifyRefresh(refreshToken);
        } catch {
            throw new InvalidCredentialsException(UserExceptionCode.INVALID_CREDENTIALS, "Invalid or expired refresh token.");
        }
    }
}
