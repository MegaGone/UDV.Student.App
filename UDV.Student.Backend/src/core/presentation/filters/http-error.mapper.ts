import { ErrorResponse } from "./error-response.interface";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionType } from "../../domain/enums/exception-type.enum";
import { DomainException } from "../../domain/exceptions/domain.exception";

const EXCEPTION_TYPE_TO_STATUS: Record<ExceptionType, HttpStatus> = {
    [ExceptionType.CONFLICT]: HttpStatus.CONFLICT,
    [ExceptionType.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ExceptionType.INVALID]: HttpStatus.UNPROCESSABLE_ENTITY,
};

export function mapErrorToHttp(exception: unknown): ErrorResponse {
    if (exception instanceof DomainException) {
        return {
            statusCode: EXCEPTION_TYPE_TO_STATUS[exception.type],
            message: exception.message,
            errorCode: exception.code,
        };
    }

    if (exception instanceof HttpException) {
        const statusCode = exception.getStatus();
        return {
            statusCode,
            message: extractHttpMessage(exception),
            errorCode: HttpStatus[statusCode] ?? "HTTP_ERROR",
        };
    }

    return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
        errorCode: "INTERNAL_ERROR",
    };
}

function extractHttpMessage(exception: HttpException): string | string[] {
    const response = exception.getResponse();

    if (typeof response === "string")
        return response;

    const message = (response as { message?: string | string[] })?.message;

    return message ?? exception.message;
}
