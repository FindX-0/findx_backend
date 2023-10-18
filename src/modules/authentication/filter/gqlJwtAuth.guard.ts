import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ExceptionMessageCode } from '@shared/constant';

import { NO_AUTH_KEY } from '../decorator/noAuth.decorator';
import { JwtHelper } from '../util/jwt.helper';

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
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

    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

    console.log(req);

    if (!req) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.INVALID_REQUEST,
      );
    }

    const authorizationHeader =
      req.headers['authorization'] || req.headers['Authorization'];

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
