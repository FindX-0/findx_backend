import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Role } from '@entities/entityEnums';
import { AdminUserQueryService } from '@modules/adminUser';
import { ExceptionMessageCode } from '@shared/constant';

import { ROLES_KEY } from '../decorator/roles.decorator';
import { JwtHelper, getBearerTokenFromRequest } from '../util';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
    private readonly adminUserQueryService: AdminUserQueryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

    const accessToken = getBearerTokenFromRequest(req);

    if (!accessToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    const payload = this.jwtHelper.getUserPayload(accessToken);

    if (!payload) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    if (!payload.isAdmin) {
      throw new ForbiddenException();
    }

    const roles = await this.adminUserQueryService.getRolesById(payload.userId);

    return requiredRoles.every((role) => roles.includes(role));
  }
}
