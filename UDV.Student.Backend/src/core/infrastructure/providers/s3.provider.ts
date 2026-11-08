import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IStorageConfiguration } from 'src/shared/configuration/storage.configuration';
import { IStorageProvider, IStorageProviderOptions, IStorageProviderResponse, IStorageReadOptions } from "src/core/domain/providers/storage.provider";

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

    public async generatePresignedReadUrl({ expiresIn, objectKey }: IStorageReadOptions): Promise<string> {
        try {
            const command: GetObjectCommand = new GetObjectCommand({
                Key: objectKey,
                Bucket: this._bucket,
            });

            return await getSignedUrl(this._s3Client, command, { expiresIn });
        } catch (error) {
            this._logger.error(`[INFRA][S3 PROVIDER] ${error}`);
            return "";
        }
    }

    public async objectExists(objectKey: string): Promise<boolean> {
        try {
            await this._s3Client.send(new HeadObjectCommand({ Key: objectKey, Bucket: this._bucket }));
            return true;
        } catch (error) {
            const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };

            if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound")
                return false;

            this._logger.error(`[INFRA][S3 PROVIDER] ${error}`);
            return false;
        }
    }

    public async deleteObject(objectKey: string): Promise<void> {
        try {
            await this._s3Client.send(new DeleteObjectCommand({ Key: objectKey, Bucket: this._bucket }));
        } catch (error) {
            // A failed cleanup only leaves an orphan object; it must not break the caller.
            this._logger.error(`[INFRA][S3 PROVIDER] ${error}`);
        }
    }
}
