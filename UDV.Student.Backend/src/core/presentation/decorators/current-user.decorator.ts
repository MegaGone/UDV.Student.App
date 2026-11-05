import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "../guards/jwt-auth.guard";

/**
 * Extracts the authenticated user's id (JWT "sub") attached by JwtAuthGuard.
 * Only meaningful on routes protected by that guard.
 */
export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): string | undefined => {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        return request.user?.sub;
    },
);
