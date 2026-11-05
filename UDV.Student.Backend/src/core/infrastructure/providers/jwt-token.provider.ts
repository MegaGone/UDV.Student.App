import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { UserEntity } from "../../domain/entities/user.entity";
import { IGlobalConfiguration } from "../../../shared/configuration/global.configuration";
import { ITokenProvider, ITokenProviderResponse, IRefreshTokenPayload } from "../../domain/providers/token.provider";

@Injectable()
export class JwtTokenProvider implements ITokenProvider {
    private readonly _config: IGlobalConfiguration;

    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
    ) {
        this._config = this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");
    }

    public async generate(user: Partial<UserEntity>): Promise<ITokenProviderResponse> {
        const jti = randomUUID();
        const payload = { sub: user.id };

        const accessToken = await this._jwtService.signAsync(payload, {
            secret: this._config.JWT_SECRET,
            expiresIn: this._config.JWT_ACCESS_EXPIRATION,
        } as JwtSignOptions);

        const refreshToken = await this._jwtService.signAsync(payload, {
            jwtid: jti,
            secret: this._config.JWT_SECRET,
            expiresIn: this._config.JWT_REFRESH_EXPIRATION,
        } as JwtSignOptions);

        const { exp } = this._jwtService.decode(refreshToken) as { exp: number };
        const refreshTtlSeconds = exp - Math.floor(Date.now() / 1000);

        return { accessToken, refreshToken, jti, refreshTtlSeconds };
    }

    public async verifyRefresh(token: string): Promise<IRefreshTokenPayload> {
        const payload = await this._jwtService.verifyAsync<{ sub: string; jti: string }>(token, {
            secret: this._config.JWT_SECRET,
        });

        return { userId: payload.sub, jti: payload.jti };
    }
}
