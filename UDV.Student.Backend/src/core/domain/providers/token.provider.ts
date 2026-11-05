import { UserEntity } from "../entities/user.entity";

export type ITokenProviderResponse = {
    jti: string;
    accessToken: string;
    refreshToken: string;
    refreshTtlSeconds: number;
}

export type IRefreshTokenPayload = {
    jti: string;
    userId: string;
}

export abstract class ITokenProvider {
    public abstract generate(user: Partial<UserEntity>): Promise<ITokenProviderResponse>;
    public abstract verifyRefresh(token: string): Promise<IRefreshTokenPayload>;
}
