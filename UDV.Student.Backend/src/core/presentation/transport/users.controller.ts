import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UploadAvatarDto } from "./dto/upload-avatar.dto";
import { ConfirmAvatarDto } from "./dto/confirm-avatar.dto";
import { CurrentUser } from "../decorators/current-user.decorator";
import { UploadMediaResponseDto } from "../../application/use-cases/upload-media/upload-media.dto";
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { ConfirmAvatarResponseDto } from "../../application/use-cases/confirm-avatar/confirm-avatar.dto";
import { GetUserProfileUseCase, UploadMediaUseCase, ConfirmAvatarUseCase } from "../../application/use-cases";
import { GetUserProfileResponseDto } from "../../application/use-cases/get-user-profile/get-user-profile.dto";
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly _getUserProfileUseCase: GetUserProfileUseCase,
        private readonly _uploadMediaUseCase: UploadMediaUseCase,
        private readonly _confirmAvatarUseCase: ConfirmAvatarUseCase,
    ) { }

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get the authenticated user's profile, including a signed avatar URL" })
    @ApiOkResponse({
        description: "Profile retrieved successfully.",
        schema: {
            properties: {
                id: { type: "string" },
                email: { type: "string" },
                username: { type: "string" },
                avatarUrl: { type: "string", nullable: true },
            },
        },
    })
    @ApiUnauthorizedResponse({ description: "Missing, invalid, or expired access token." })
    @ApiNotFoundResponse({ description: "User not found." })
    public getProfile(@CurrentUser() userId: string): Promise<GetUserProfileResponseDto> {
        return this._getUserProfileUseCase.execute({ userId });
    }

    @Post("me/avatar/upload-url")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get a presigned URL to upload a new avatar directly to storage" })
    @ApiCreatedResponse({ description: "Presigned upload URL generated. The client must PUT the file, then confirm." })
    @ApiBadRequestResponse({ description: "Validation failed (missing file name or content type)." })
    @ApiUnprocessableEntityResponse({ description: "Media type not allowed." })
    @ApiUnauthorizedResponse({ description: "Missing, invalid, or expired access token." })
    public requestAvatarUploadUrl(
        @CurrentUser() userId: string,
        @Body() { fileName, contentType }: UploadAvatarDto,
    ): Promise<UploadMediaResponseDto> {
        return this._uploadMediaUseCase.execute({ userId, fileName, contentType });
    }

    @Patch("me/avatar")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Confirm an uploaded avatar, persist it, and delete the previous one" })
    @ApiOkResponse({ description: "Avatar confirmed and persisted." })
    @ApiBadRequestResponse({ description: "Validation failed (missing object key)." })
    @ApiUnprocessableEntityResponse({ description: "Object key does not belong to the user, or the upload was not found." })
    @ApiUnauthorizedResponse({ description: "Missing, invalid, or expired access token." })
    @ApiNotFoundResponse({ description: "User not found." })
    public confirmAvatar(
        @CurrentUser() userId: string,
        @Body() { objectKey }: ConfirmAvatarDto,
    ): Promise<ConfirmAvatarResponseDto> {
        return this._confirmAvatarUseCase.execute({ userId, objectKey });
    }
}
