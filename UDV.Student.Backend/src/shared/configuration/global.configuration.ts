import { registerAs } from "@nestjs/config";
import { ScalarTheme } from "../documentation/scalar.configuration";

export interface IGlobalConfiguration {
    PORT: number;
    SALT: number;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    API_VERSION: string;
    DEBUG_MODE: boolean;
    SEED_PASSWORD: string;
    REDIS_PASSWORD: string;
    SCALAR_THEME: ScalarTheme;
    RESET_ALL_ON_STARTUP: boolean;
    JWT_ACCESS_EXPIRATION: string;
    JWT_REFRESH_EXPIRATION: string;
}

export default registerAs<IGlobalConfiguration>("GLOBAL", () => ({
    SALT: +process.env.SALT || 10,
    PORT: +process.env.PORT || 3000,
    DEBUG_MODE: process.env.DEBUG_MODE === "1",
    REDIS_PORT: +process.env.REDIS_PORT || 6379,
    API_VERSION: process.env.API_VERSION || "v1",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    SEED_PASSWORD: process.env.SEED_PASSWORD || "Seed.Udv2026",
    RESET_ALL_ON_STARTUP: process.env.RESET_ALL_ON_STARTUP === "1",
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "15m",
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",
    SCALAR_THEME: (process.env.SCALAR_THEME as ScalarTheme) || "deepSpace",
    JWT_SECRET: process.env.JWT_SECRET || "change-me-to-a-long-random-secret",
}));