import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthController } from "./transport/auth.controller";
import { UsersController } from "./transport/users.controller";
import { ApplicationModule } from "../application/application.module";

@Module({
    imports: [ApplicationModule, JwtModule.register({})],
    controllers: [AuthController, UsersController],
    providers: [JwtAuthGuard],
})
export class PresentationModule { }
