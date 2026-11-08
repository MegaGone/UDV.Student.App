import {
    LogoutUseCase,
    StoreUserUseCase,
    UploadMediaUseCase,
    ConfirmAvatarUseCase,
    RefreshTokenUseCase,
    GetUserProfileUseCase,
    AuthenticateUserUseCase,
} from "./use-cases";
import { Module } from "@nestjs/common";
import { SeedService } from "../infrastructure/services/seed.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
    imports: [InfrastructureModule],
    exports: [
        LogoutUseCase,
        StoreUserUseCase,
        UploadMediaUseCase,
        ConfirmAvatarUseCase,
        RefreshTokenUseCase,
        GetUserProfileUseCase,
        AuthenticateUserUseCase,
    ],
    providers: [
        SeedService,
        LogoutUseCase,
        StoreUserUseCase,
        UploadMediaUseCase,
        ConfirmAvatarUseCase,
        RefreshTokenUseCase,
        GetUserProfileUseCase,
        AuthenticateUserUseCase,
    ],
})
export class ApplicationModule { }
