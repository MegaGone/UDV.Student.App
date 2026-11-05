import { Response } from "express";
import { mapErrorToHttp } from "./http-error.mapper";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly _logger = new Logger(HttpExceptionFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();

        const error = mapErrorToHttp(exception);

        if (error.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR)
            this._logger.error(error.message, (exception as Error)?.stack);

        response.status(error.statusCode).json(error);
    }
}
