import Redis from "ioredis";
import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IGlobalConfiguration } from "../../../shared/configuration/global.configuration";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const RedisProvider: Provider = {
    provide: REDIS_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Redis => {
        const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } =
            configService.getOrThrow<IGlobalConfiguration>("GLOBAL");

        return new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASSWORD || undefined,
        });
    },
};
