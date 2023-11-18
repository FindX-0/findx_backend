import {
  BadRequestException,
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { ExceptionMessageCode } from '@shared/constant';

import { UserAuthPayload } from '../type';
import { getBearerTokenFromRequest } from '../util';
import { JwtHelper } from '../util/jwt.helper';

export const GqlAuthPayload = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

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
export class GqlAuthPayloadInterceptor implements NestInterceptor {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);

    const { req } = gqlContext.getContext();

    const jwtToken = getBearerTokenFromRequest(req);

    if (!jwtToken) {
      req.userAuthPayload = null;
      return next.handle();
    }

    req.userAuthPayload = this.jwtHelper.getUserPayload(jwtToken);

    return next.handle();
  }
}
