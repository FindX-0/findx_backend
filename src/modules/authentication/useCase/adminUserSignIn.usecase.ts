import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AdminUserQueryService } from '@modules/adminUser/adminUserQuery.service';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthTokenPayload } from '../authentication.type';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

type Values = {
  email: string;
  password: string;
};

@Injectable()
export class AdminUserSignIn {
  constructor(
    private readonly adminUserQueryService: AdminUserQueryService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call({ email, password }: Values): Promise<AuthTokenPayload> {
    const adminUser = await this.adminUserQueryService.getByEmail(email);

    if (!adminUser) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      password,
      adminUser.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAdminAuthTokens({ userId: adminUser.id });

    await this.refreshTokenService.create({
      adminUserId: adminUser.id,
      value: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
