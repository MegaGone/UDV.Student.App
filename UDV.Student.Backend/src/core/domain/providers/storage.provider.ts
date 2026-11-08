export interface IStorageProviderOptions {
    expiresIn: number;
    objectKey: string;
    contentType: string;
}

export interface IStorageProviderResponse {
    uploadUrl: string;
}

export abstract class IStorageProvider {
    public abstract generatePresignedUrl(options: IStorageProviderOptions): Promise<IStorageProviderResponse>
}
