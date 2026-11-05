import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthenticateUserUseCase, RefreshTokenUseCase, LogoutUseCase } from "../../application/use-cases";
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiNoContentResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { AuthenticateUserResponseDto } from "../../application/use-cases/authenticate-user-use-case/authenticate-user.dto";
import { RefreshTokenResponseDto } from "../../application/use-cases/refresh-token-use-case/refresh-token.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly _logoutUseCase: LogoutUseCase,
        private readonly _refreshTokenUseCase: RefreshTokenUseCase,
        private readonly _authenticateUserUseCase: AuthenticateUserUseCase,
    ) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Authenticate a user and issue access/refresh tokens" })
    @ApiOkResponse({
        description: "Authentication successful.",
        schema: {
            properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
            },
        },
    })
    @ApiBadRequestResponse({ description: "Validation failed (malformed email or empty password)." })
    @ApiUnprocessableEntityResponse({ description: "Invalid credentials or inactive user." })
    public login(@Body() { email, password }: LoginDto): Promise<AuthenticateUserResponseDto> {
        return this._authenticateUserUseCase.execute({ email, password });
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Rotate the refresh token and issue a fresh token pair" })
    @ApiOkResponse({
        description: "Tokens rotated successfully.",
        schema: {
            properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
            },
        },
    })
    @ApiBadRequestResponse({ description: "Validation failed (missing refresh token)." })
    @ApiUnprocessableEntityResponse({ description: "Invalid, expired, or reused refresh token." })
    public refresh(@Body() { refreshToken }: RefreshDto): Promise<RefreshTokenResponseDto> {
        return this._refreshTokenUseCase.execute({ refreshToken });
    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Log out everywhere (revoke all sessions of the user)" })
    @ApiNoContentResponse({ description: "All sessions revoked." })
    @ApiUnauthorizedResponse({ description: "Missing, invalid, or expired access token." })
    public logout(@CurrentUser() userId: string): Promise<void> {
        return this._logoutUseCase.execute(userId);
    }
}
