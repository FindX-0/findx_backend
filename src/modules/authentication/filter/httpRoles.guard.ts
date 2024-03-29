import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@entities/index';
import { AdminUserQueryService } from '@modules/adminUser/adminUserQuery.service';
import { ExceptionMessageCode } from '@shared/constant';
import { getContextRequest } from '@shared/util';

import { ROLES_KEY } from '../decorator/roles.decorator';
import { getBearerTokenFromRequest } from '../util/getBearerTokenFromRequest';
import { JwtHelper } from '../util/jwt.helper';

@Injectable()
export class HttpRolesGuard implements CanActivate {
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

    const req = getContextRequest(context);

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

    return requiredRoles.some((role) => roles.includes(role));
  }
}
