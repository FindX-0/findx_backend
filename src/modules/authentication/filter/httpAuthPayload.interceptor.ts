import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ExceptionMessageCode } from '@shared/constant';
import { getContextRequest } from '@shared/util';

import { UserAuthPayload } from '../type/userAuthPayload.type';
import { getBearerTokenFromRequest } from '../util/getBearerTokenFromRequest';
import { JwtHelper } from '../util/jwt.helper';

export const HttpAuthPayload = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = getContextRequest(context);

    if (!req) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.INVALID_REQUEST,
      );
    }

    if (!req.userAuthPayload) {
      throw new BadRequestException(
        ExceptionMessageCode.MISSING_AUTH_USER_PAYLOAD,
      );
    }

    return req?.userAuthPayload as UserAuthPayload;
  },
);

@Injectable()
export class HttpAuthPayloadInterceptor implements NestInterceptor {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = getContextRequest(context);

    const jwtToken = getBearerTokenFromRequest(req);

    if (!jwtToken) {
      req.userAuthPayload = null;
      return next.handle();
    }

    req.userAuthPayload = this.jwtHelper.getUserPayload(jwtToken);

    return next.handle();
  }
}
