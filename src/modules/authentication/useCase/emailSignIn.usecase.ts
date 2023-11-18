import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AccountVerificationService } from '@modules/accountVerification';
import { UserService } from '@modules/user';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthenticationPayload, SignInParams } from '../authentication.type';
import { JwtHelper, PasswordEncoder } from '../util';

@Injectable()
export class EmailSignInUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly accountVerificationService: AccountVerificationService,
  ) {}

  async call(params: SignInParams): Promise<AuthenticationPayload> {
    const user = await this.userService.getByEmail(params.email);

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

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({ userId: user.id });

    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    const hasEmailVerified =
      await this.accountVerificationService.getIsVerifiedByUserId(user.id);

    return { accessToken, refreshToken, hasEmailVerified };
  }
}
