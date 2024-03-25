import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AuthProvider } from '@entities/index';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { UserValidator } from '@modules/user/user.validator';
import { ExceptionMessageCode } from '@shared/constant';

import { randomHEX } from '../../../shared/util/random';
import { CreateUser } from '../../user/usecase/createUser.usecase';
import { AuthPayloadObject } from '../gql/authPayload.object';
import { GoogleOauthHelper } from '../util/googleOauth.helper';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Injectable()
export class GoogleSignIn {
  constructor(
    private readonly googleOauthHelper: GoogleOauthHelper,
    private readonly userValidator: UserValidator,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly createUser: CreateUser,
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

    const generatedPassword = randomHEX(16);

    const hashedPassword = await this.passwordEncoder.encode(generatedPassword);

    const user = await this.createUser.execute({
      userParams: {
        email,
        userName: null,
        deviceId: null,
        passwordHash: hashedPassword,
        isCompleted: false,
        authProvider: AuthProvider.GOOGLE,
      },
      userMetaParams: {
        trophies: 0,
      },
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
