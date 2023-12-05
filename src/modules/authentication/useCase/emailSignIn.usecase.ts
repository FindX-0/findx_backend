import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AccountVerificationService } from '@modules/accountVerification';
import { RefreshTokenService } from '@modules/refreshToken';
import { UserQueryService } from '@modules/user';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthenticationPayload, SignInParams } from '../authentication.type';
import { JwtHelper, PasswordEncoder } from '../util';

@Injectable()
export class EmailSignInUseCase {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly accountVerificationService: AccountVerificationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call(params: SignInParams): Promise<AuthenticationPayload> {
    const user = await this.userQueryService.getByEmail(params.email);

    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const passwordMatches = await this.passwordEncoder.matches(
      params.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    const { accessToken, refreshToken } = this.jwtHelper.generateAuthTokens({
      userId: user.id,
    });

    await this.refreshTokenService.create({
      userId: user.id,
      value: refreshToken,
    });

    const hasEmailVerified =
      await this.accountVerificationService.getIsVerifiedByUserId(user.id);

    return { accessToken, refreshToken, hasEmailVerified };
  }
}
