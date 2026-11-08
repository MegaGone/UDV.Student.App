import { Provider } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { IStorageConfiguration } from "src/shared/configuration/storage.configuration";

export const S3_CLIENT_KEY = "S3_CLIENT";

export const S3_CLIENT: Provider = {
    provide: S3_CLIENT_KEY,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): S3Client => {
        const { STORAGE_PUBLIC_ENDPOINT, STORAGE_REGION, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY } = configService.getOrThrow<IStorageConfiguration>("STORAGE");

        return new S3Client({
            forcePathStyle: true,
            region: STORAGE_REGION,
            endpoint: STORAGE_PUBLIC_ENDPOINT,
            credentials: {
                accessKeyId: STORAGE_ACCESS_KEY,
                secretAccessKey: STORAGE_SECRET_KEY,
            },
        });
    },
};
