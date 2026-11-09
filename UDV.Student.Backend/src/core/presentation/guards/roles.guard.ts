import { Reflector } from "@nestjs/core";
import { AuthenticatedRequest } from "./jwt-auth.guard";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../domain/enums/user-role.enum";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
        private readonly _userRepository: IUserRepository,
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this._reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No @Roles metadata -> route is not role-restricted.
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const userId = request.user?.sub;

        if (!userId) throw new ForbiddenException("Missing authenticated user.");

        const user = await this._userRepository.findById(userId);

        if (!user || !requiredRoles.includes(user.role))
            throw new ForbiddenException("Insufficient permissions.");

        return true;
    }
}
