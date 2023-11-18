import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '@modules/user';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthenticationPayload } from '../authentication.type';
import { JwtHelper } from '../util';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async call(oldRefreshToken: string): Promise<AuthenticationPayload> {
    const isRefreshTokenValid = await this.jwtHelper.isRefreshTokenValid(
      oldRefreshToken,
      { ignoreExpiration: true },
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const user = await this.userService.findByRefreshToken(oldRefreshToken);

    if (!user) {
      const decodedPayload = this.jwtHelper.getUserPayload(oldRefreshToken);

      if (!decodedPayload) {
        throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
      }

      await this.userService.clearRefreshTokensForUser(decodedPayload.userId);
      throw new UnauthorizedException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    const payload = this.jwtHelper.getUserPayload(oldRefreshToken);

    if (
      !payload?.expirationTime ||
      Date.now() >= payload.expirationTime * 1000
    ) {
      throw new UnauthorizedException(ExceptionMessageCode.EXPIRED_TOKEN);
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.deleteRefreshToken(oldRefreshToken);
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
