import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserService, UserValidator } from '@modules/user';
import { ExceptionMessageCode } from '@shared/constant';
import { RandomGenerator } from '@shared/util';

import { AuthPayloadResponseType } from '../gql/authPayload.type';
import { JwtHelper, PasswordEncoder } from '../util';
import { GoogleOauthHelper } from '../util/googleOauth.helper';

@Injectable()
export class SignInWithGoogle {
  constructor(
    private readonly googleOauthHelper: GoogleOauthHelper,
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly randomGenerator: RandomGenerator,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async call(googleAccessToken: string): Promise<AuthPayloadResponseType> {
    const { email } = await this.googleOauthHelper.getGoogleUserInfo(
      googleAccessToken,
    );

    if (!email) {
      throw new ForbiddenException(
        ExceptionMessageCode.CANT_SIGN_IN_WITH_GOOGLE,
      );
    }

    await this.userValidator.validateUniqueEmail(email);

    const generatedPassword = this.randomGenerator.hex(16);

    const hashedPassword = await this.passwordEncoder.encode(generatedPassword);

    const user = await this.userService.create({
      email,
      gender: null,
      userName: null,
      passwordHash: hashedPassword,
      isCompleted: false,
    });

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken, hasEmailVerified: false };
  }
}
