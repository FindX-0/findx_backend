import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_AUTH_KEY } from './decorator/noAuth.decorator';
import { NO_EMAIL_VERIFICATION_VALIDATE } from './decorator/noEmailVerificationValidate.decorator';
import { JwtHelper } from './util/jwt.helper';
import { ExceptionMessageCode } from '../../shared';
import { AccountVerificationService } from '../accountVerification/accountVerification.service';

@Injectable()
export class VerifiedEmailValidatorGuard implements CanActivate {
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

    const payload = this.jwtHelper.getUserPayload(accessToken);

    if (!payload) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    return this.accountVerificationService.getIsVerifiedByUserId(
      payload.userId,
    );
  }
}
