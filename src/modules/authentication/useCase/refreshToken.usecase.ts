import { Injectable, UnauthorizedException } from '@nestjs/common';

import { RefreshTokenService } from '@modules/refreshToken';
import { UserService } from '@modules/user';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthenticationPayload } from '../authentication.type';
import { JwtHelper } from '../util';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
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

      await this.refreshTokenService.deleteAllByUserId(decodedPayload.userId);
      throw new UnauthorizedException(ExceptionMessageCode.REFRESH_TOKEN_REUSE);
    }

    const payload = this.jwtHelper.getUserPayload(oldRefreshToken);

    if (
      !payload?.expirationTime ||
      Date.now() >= payload.expirationTime * 1000
    ) {
      throw new UnauthorizedException(ExceptionMessageCode.EXPIRED_TOKEN);
    }

    const { accessToken, refreshToken } = this.jwtHelper.generateAuthTokens({
      userId: user.id,
    });

    await Promise.all([
      this.refreshTokenService.deleteByValue(oldRefreshToken),
      this.refreshTokenService.create({
        userId: user.id,
        value: refreshToken,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
