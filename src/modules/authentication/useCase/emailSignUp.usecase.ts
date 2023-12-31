import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { AuthProvider } from '@entities/index';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { UserValidator } from '@modules/user/user.validator';
import { UserMutationService } from '@modules/user/userMutation.service';
import { ExceptionMessageCode } from '@shared/constant';

import {
  AuthenticationPayload,
  SignUpWithTokenParams,
} from '../authentication.type';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Injectable()
export class EmailSignUpUseCase {
  constructor(
    private readonly userService: UserMutationService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly userValidator: UserValidator,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call({
    userName,
    email,
    password,
  }: SignUpWithTokenParams): Promise<AuthenticationPayload> {
    await this.userValidator.validateUniqueEmail(email);

    const hashedPassword = await this.passwordEncoder.encode(password);

    const user = await this.userService.create({
      email,
      userName,
      passwordHash: hashedPassword,
      isCompleted: true,
      authProvider: AuthProvider.EMAIL,
      deviceId: null,
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

    return { accessToken, refreshToken, hasEmailVerified: false };
  }
}
