import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
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
export class GqlAuthPayloadInterceptor implements NestInterceptor {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

    if (!req) {
      return next.handle();
    }

    const authorizationHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    const jwtToken = authorizationHeader?.slice('Bearer '.length);

    if (!authorizationHeader) {
      req.userAuthPayload = null;
      return next.handle();
    }

    if (jwtToken) {
      req.userAuthPayload = this.jwtHelper.getUserPayload(jwtToken) ?? null;
    }

    return next.handle();
  }
}
