import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UserRole } from "../../domain/enums/user-role.enum";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthenticateUserUseCase, RefreshTokenUseCase, LogoutUseCase, StoreUserUseCase } from "../../application/use-cases";
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiNoContentResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse, ApiConflictResponse, ApiForbiddenResponse } from "@nestjs/swagger";
import { AuthenticateUserResponseDto } from "../../application/use-cases/authenticate-user-use-case/authenticate-user.dto";
import { RefreshTokenResponseDto } from "../../application/use-cases/refresh-token-use-case/refresh-token.dto";
import { StoreUserResponseDto } from "../../application/use-cases/store-user-use-case/store-user.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly _logoutUseCase: LogoutUseCase,
        private readonly _storeUserUseCase: StoreUserUseCase,
        private readonly _refreshTokenUseCase: RefreshTokenUseCase,
        private readonly _authenticateUserUseCase: AuthenticateUserUseCase,
    ) { }

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Register a new user account (admins only)" })
    @ApiCreatedResponse({
        description: "Account created successfully.",
        schema: {
            properties: {
                email: { type: "string" },
                username: { type: "string" },
            },
        },
    })
    @ApiBadRequestResponse({ description: "Validation failed (invalid email, short username, or empty password)." })
    @ApiUnauthorizedResponse({ description: "Missing, invalid, or expired access token." })
    @ApiForbiddenResponse({ description: "Authenticated user is not an administrator." })
    @ApiConflictResponse({ description: "Email already exists." })
    public register(@Body() { email, username, password }: RegisterDto): Promise<StoreUserResponseDto> {
        return this._storeUserUseCase.execute({ email, username, password });
    }

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
