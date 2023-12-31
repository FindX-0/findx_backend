import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AuthProvider } from '@entities/index';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { UserValidator } from '@modules/user/user.validator';
import { UserMutationService } from '@modules/user/userMutation.service';
import { ExceptionMessageCode } from '@shared/constant';
import { RandomGenerator } from '@shared/util';

import { AuthPayloadObject } from '../gql/authPayload.object';
import { GoogleOauthHelper } from '../util/googleOauth.helper';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Injectable()
export class GoogleSignInUseCase {
  constructor(
    private readonly googleOauthHelper: GoogleOauthHelper,
    private readonly userService: UserMutationService,
    private readonly userValidator: UserValidator,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly randomGenerator: RandomGenerator,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call(googleAccessToken: string): Promise<AuthPayloadObject> {
    const { email } =
      await this.googleOauthHelper.getGoogleUserInfo(googleAccessToken);

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
      userName: null,
      deviceId: null,
      passwordHash: hashedPassword,
      isCompleted: false,
      authProvider: AuthProvider.GOOGLE,
    });

    if (!user) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_USER,
      );
    }

    const { accessToken, refreshToken } = this.jwtHelper.generateAuthTokens({
      userId: user.id,
    });

    await this.refreshTokenService.create({
      userId: user.id,
      value: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
