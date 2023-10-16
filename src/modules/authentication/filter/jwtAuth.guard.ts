import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ExceptionMessageCode } from '../../../shared';
import { NO_AUTH_KEY } from '../decorator/noAuth.decorator';
import { JwtHelper } from '../util/jwt.helper';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
  ) {}

  canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authorizationHeader) {
      return false;
    }

    const accessToken = authorizationHeader.slice('Bearer '.length);

    if (!accessToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    return this.jwtHelper.isAccessTokenValid(accessToken);
  }
}
