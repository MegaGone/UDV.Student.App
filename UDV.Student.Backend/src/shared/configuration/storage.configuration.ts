import { registerAs } from "@nestjs/config";

export interface IStorageConfiguration {
    STORAGE_BUCKET: string;
    STORAGE_REGION: string;
    STORAGE_ACCESS_KEY: string;
    STORAGE_SECRET_KEY: string;
    STORAGE_PUBLIC_ENDPOINT: string;
}

export default registerAs<IStorageConfiguration>("STORAGE", () => ({
    STORAGE_BUCKET: process.env.STORAGE_BUCKET || "images",
    STORAGE_REGION: process.env.STORAGE_REGION || "us-east-1",
    STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY || "minioadmin",
    STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY || "minioadmin",
    STORAGE_PUBLIC_ENDPOINT: process.env.STORAGE_PUBLIC_ENDPOINT || "http://localhost:9000",
}));
