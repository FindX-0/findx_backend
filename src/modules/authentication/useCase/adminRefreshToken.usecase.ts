import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AdminUserQueryService } from '@modules/adminUser';
import { RefreshTokenService } from '@modules/refreshToken';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthenticationPayload } from '../authentication.type';
import { JwtHelper } from '../util';

@Injectable()
export class AdminRefreshTokenUseCase {
  constructor(
    private readonly adminUserQueryService: AdminUserQueryService,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call(oldRefreshToken: string): Promise<AuthenticationPayload> {
    const isRefreshTokenValid = await this.jwtHelper.isAdminRefreshTokenValid(
      oldRefreshToken,
      { ignoreExpiration: true },
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
    }

    const adminUserId = await this.refreshTokenService.getAdminUserIdByValue(
      oldRefreshToken,
    );

    const adminUser = adminUserId
      ? await this.adminUserQueryService.getById(adminUserId)
      : null;

    if (!adminUser) {
      const decodedPayload = this.jwtHelper.getUserPayload(oldRefreshToken);

      if (!decodedPayload) {
        throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
      }

      await this.refreshTokenService.deleteAllByAdminUserId(
        decodedPayload.userId,
      );

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
      this.jwtHelper.generateAdminAuthTokens({ userId: adminUser.id });

    await Promise.all([
      this.refreshTokenService.deleteByValue(oldRefreshToken),
      this.refreshTokenService.create({
        adminUserId: adminUser.id,
        value: refreshToken,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
