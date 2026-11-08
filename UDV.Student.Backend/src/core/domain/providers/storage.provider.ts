export interface IStorageProviderOptions {
    expiresIn: number;
    objectKey: string;
    contentType: string;
}

export interface IStorageProviderResponse {
    uploadUrl: string;
}

export interface IStorageReadOptions {
    expiresIn: number;
    objectKey: string;
}

export abstract class IStorageProvider {
    public abstract generatePresignedUrl(options: IStorageProviderOptions): Promise<IStorageProviderResponse>
    public abstract generatePresignedReadUrl(options: IStorageReadOptions): Promise<string>
    public abstract objectExists(objectKey: string): Promise<boolean>
    public abstract deleteObject(objectKey: string): Promise<void>
}
