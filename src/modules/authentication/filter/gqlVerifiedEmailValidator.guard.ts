import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccountVerificationService } from '@modules/accountVerification';
import { ExceptionMessageCode } from '@shared/constant';

import { NO_AUTH_KEY } from '../decorator/noAuth.decorator';
import { NO_EMAIL_VERIFICATION_VALIDATE } from '../decorator/noEmailVerificationValidate.decorator';
import { JwtHelper } from '../util/jwt.helper';

@Injectable()
export class GqlVerifiedEmailValidatorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
    private readonly accountVerificationService: AccountVerificationService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noAuth) {
      return true;
    }

    const noEmailVerifyValidate = this.reflector.getAllAndOverride<boolean>(
      NO_EMAIL_VERIFICATION_VALIDATE,
      [context.getHandler(), context.getClass()],
    );

    if (noEmailVerifyValidate) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

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

    const payload = this.jwtHelper.getUserPayload(accessToken);

    if (!payload) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    return this.accountVerificationService.getIsVerifiedByUserId(
      payload.userId,
    );
  }
}
