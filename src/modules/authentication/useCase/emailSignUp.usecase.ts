import { Injectable } from '@nestjs/common';

import { UserService, UserValidator } from '@modules/user';

import {
  AuthenticationPayload,
  SignUpWithTokenParams,
} from '../authentication.type';
import { JwtHelper, PasswordEncoder } from '../util';

@Injectable()
export class EmailSignUpUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly userValidator: UserValidator,
  ) {}

  async call({
    userName,
    email,
    gender,
    password,
  }: SignUpWithTokenParams): Promise<AuthenticationPayload> {
    await this.userValidator.validateUniqueEmail(email);

    const hashedPassword = await this.passwordEncoder.encode(password);

    const user = await this.userService.create({
      email,
      gender,
      userName,
      passwordHash: hashedPassword,
      isCompleted: true,
    });

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken, hasEmailVerified: false };
  }
}
