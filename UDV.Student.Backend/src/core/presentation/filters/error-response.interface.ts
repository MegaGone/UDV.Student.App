export interface ErrorResponse {
    errorCode: string;
    statusCode: number;
    message: string | Array<string>;
}
