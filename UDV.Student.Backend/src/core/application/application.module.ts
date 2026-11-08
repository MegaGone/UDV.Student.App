import {
    LogoutUseCase,
    StoreUserUseCase,
    UploadMediaUseCase,
    RefreshTokenUseCase,
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
        RefreshTokenUseCase,
        AuthenticateUserUseCase,
    ],
    providers: [
        SeedService,
        LogoutUseCase,
        StoreUserUseCase,
        RefreshTokenUseCase,
        AuthenticateUserUseCase,
        UploadMediaUseCase
    ],
})
export class ApplicationModule { }
