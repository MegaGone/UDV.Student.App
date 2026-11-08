import { extname } from "path";
import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MediaExceptionCode } from "src/core/domain/enums/exception.enum";
import { IStorageProvider } from "src/core/domain/providers/storage.provider";
import { UploadMediaRequestDto, UploadMediaResponseDto } from "./upload-media.dto";
import { IGlobalConfiguration } from "src/shared/configuration/global.configuration";
import { MediaTypeUploadException } from "src/core/domain/exceptions/media-type-upload.exception";
import { MediaTypeNotAllowedException } from "src/core/domain/exceptions/media-type-not-allowed.exception";

@Injectable()
export class UploadMediaUseCase {
    private readonly _defaultMethod: string;
    private readonly _expirationTimeInSeconds: number;
    private readonly _allowedMediaTypes: Array<string>;

    constructor(
        private readonly _configService: ConfigService,
        private readonly _storageProvider: IStorageProvider,
    ) {
        this._defaultMethod = "PUT";

        const { ALLOWED_MEDIA_TYPE, PRESIGNED_URL_EXPIRE_TIME } =
            this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");

        this._allowedMediaTypes = ALLOWED_MEDIA_TYPE;
        this._expirationTimeInSeconds = PRESIGNED_URL_EXPIRE_TIME;
    }

    public async execute({ userId, fileName, contentType }: UploadMediaRequestDto): Promise<UploadMediaResponseDto> {
        if (!this._allowedMediaTypes.includes(contentType))
            throw new MediaTypeNotAllowedException(MediaExceptionCode.INVALID_MEDIA_TYPE, "Media type not allowed")

        const extension = extname(fileName).toLowerCase();
        const objectKey = `${userId}/${randomUUID()}${extension}`;
        const { uploadUrl } = await this._storageProvider.generatePresignedUrl({ objectKey, contentType, expiresIn: this._expirationTimeInSeconds });

        if (!uploadUrl || uploadUrl === "")
            throw new MediaTypeUploadException(MediaExceptionCode.ERROR_UPLOADING_MEDIA, "Error uploading media");

        // TODO: UPDATE COLUMN REFERNCE IN USER TABLE

        return new UploadMediaResponseDto(this._defaultMethod, uploadUrl, objectKey, this._expirationTimeInSeconds, { "Content-Type": contentType })
    }
}