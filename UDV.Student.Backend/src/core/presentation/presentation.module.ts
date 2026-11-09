import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./guards/roles.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthController } from "./transport/auth.controller";
import { UsersController } from "./transport/users.controller";
import { ApplicationModule } from "../application/application.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
    imports: [ApplicationModule, InfrastructureModule, JwtModule.register({})],
    controllers: [AuthController, UsersController],
    providers: [JwtAuthGuard, RolesGuard],
})
export class PresentationModule { }
