export class UploadMediaRequestDto {
    userId: string;
    fileName: string;
    contentType: string;
}

export class UploadMediaHeaderResponseDto {
    "Content-Type": string;
}

export class UploadMediaResponseDto {
    method: string;
    uploadUrl: string;
    objectKey: string;
    expiresIn: number;
    headers: UploadMediaHeaderResponseDto

    constructor(method: string, uploadUrl: string, objectKey: string, expiresIn: number, headers: UploadMediaHeaderResponseDto) {
        this.method = method;
        this.headers = headers;
        this.uploadUrl = uploadUrl;
        this.objectKey = objectKey;
        this.expiresIn = expiresIn;
    }
}
