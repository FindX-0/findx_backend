import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { JwtHelper } from '@modules/authentication';
import { ExceptionMessageCode } from '@shared/constant';

@Injectable()
export class GatewayJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();

    const accessToken = socket.handshake.query?.['accessToken'] as
      | string
      | undefined;

    if (!accessToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    const payload = this.jwtHelper.getUserPayload(accessToken);

    if (!payload) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    if (payload.isAdmin) {
      return this.jwtHelper.isAdminAccessTokenValid(accessToken);
    }

    return this.jwtHelper.isAccessTokenValid(accessToken);
  }
}
