import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IGlobalConfiguration } from "../../../shared/configuration/global.configuration";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

export type AccessTokenPayload = {
    sub: string;
};

export type AuthenticatedRequest = Request & { user?: AccessTokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = this.extractToken(request);

        if (!token) throw new UnauthorizedException("Missing access token.");

        try {
            const { JWT_SECRET } = this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");
            request.user = await this._jwtService.verifyAsync<AccessTokenPayload>(token, { secret: JWT_SECRET });
        } catch {
            throw new UnauthorizedException("Invalid or expired access token.");
        }

        return true;
    }

    private extractToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
