import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./repositories/user.repository";
import { JwtTokenProvider } from "./providers/jwt-token.provider";
import { ITokenProvider } from "../domain/providers/token.provider";
import { ICryptoProvider } from "../domain/providers/crypto.provider";
import { IUserRepository } from "../domain/repositories/user.repository";
import { REDIS_CLIENT, RedisProvider } from "./providers/redis.provider";
import { BcryptCryptoProvider } from "./providers/bcrypt-crypto.provider";
import { ISessionStore } from "../domain/providers/session-store.provider";
import { RedisSessionStore } from "./providers/redis-session-store.provider";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSchema]),
        JwtModule.register({}),
    ],
    providers: [
        RedisProvider,
        { provide: IUserRepository, useClass: UserRepository },
        { provide: ISessionStore, useClass: RedisSessionStore },
        { provide: ITokenProvider, useClass: JwtTokenProvider },
        { provide: ICryptoProvider, useClass: BcryptCryptoProvider },
    ],
    exports: [IUserRepository, ICryptoProvider, ITokenProvider, ISessionStore, REDIS_CLIENT],
})
export class InfrastructureModule { }
