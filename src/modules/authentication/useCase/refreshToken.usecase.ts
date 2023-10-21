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
    //TODO check only for token validity (not for expiration !) ↓
    const isRefreshTokenValid = await this.jwtHelper.isRefreshTokenValid(
      oldRefreshToken,
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

    //TODO check for expiration only

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.deleteRefreshToken(oldRefreshToken);
    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
