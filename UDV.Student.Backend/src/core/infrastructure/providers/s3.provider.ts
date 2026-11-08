import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IStorageConfiguration } from 'src/shared/configuration/storage.configuration';
import { IStorageProvider, IStorageProviderOptions, IStorageProviderResponse } from "src/core/domain/providers/storage.provider";

export class S3Provider implements IStorageProvider {
    private readonly _bucket: string;
    private readonly _logger = new Logger(S3Provider.name);

    constructor(
        @Inject('S3_CLIENT')
        private readonly _s3Client: S3Client,
        private readonly _configService: ConfigService
    ) {
        const { STORAGE_BUCKET } = this._configService.getOrThrow<IStorageConfiguration>("STORAGE");

        this._bucket = STORAGE_BUCKET
    }

    public async generatePresignedUrl({ expiresIn, contentType, objectKey }: IStorageProviderOptions): Promise<IStorageProviderResponse> {
        try {
            const command: PutObjectCommand = new PutObjectCommand({
                Key: objectKey,
                Bucket: this._bucket,
                ContentType: contentType,
            });

            const uploadUrl: string = await getSignedUrl(
                this._s3Client,
                command,
                {
                    expiresIn: expiresIn,
                    signableHeaders: new Set(['content-type']),
                },
            );

            return { uploadUrl }
        } catch (error) {
            this._logger.error(`[INFRA][S3 PROVIDER] ${error}`);
            return { uploadUrl: "" }
        }
    }
}
