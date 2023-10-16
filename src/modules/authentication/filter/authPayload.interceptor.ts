import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ExceptionMessageCode } from '../../../shared';
import { UserAuthPayload } from '../type/userAuthPayload.type';
import { JwtHelper } from '../util/jwt.helper';

export interface AuthPayloadRequest extends Request {
  userAuthPayload: UserAuthPayload | null;
}

export const AuthPayload = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthPayloadRequest>();

    if (!request.userAuthPayload) {
      throw new BadRequestException(
        ExceptionMessageCode.MISSING_AUTH_USER_PAYLOAD,
      );
    }

    return request?.userAuthPayload;
  },
);

@Injectable()
export class AuthPayloadInterceptor implements NestInterceptor {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<AuthPayloadRequest>();

    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    const jwtToken = authorizationHeader?.slice('Bearer '.length);

    if (!authorizationHeader) {
      request.userAuthPayload = null;
      return next.handle();
    }

    if (jwtToken) {
      request.userAuthPayload = this.jwtHelper.getUserPayload(jwtToken) ?? null;
    }

    return next.handle();
  }
}
