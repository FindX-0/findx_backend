import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PasswordEncoder } from './util/password.encoder';
import { JwtHelper } from './util/jwt.helper';
import { ExceptionMessageCode } from 'src/shared';
import {
  AuthenticationPayload,
  SignInParams,
  SignUpWithTokenParams,
} from './authentication.type';
import { AccountVerificationService } from '../accountVerification/accountVerification.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly accountVerificationService: AccountVerificationService,
  ) {}

  async signUpWithToken({
    userName,
    email,
    gender,
    password,
  }: SignUpWithTokenParams): Promise<AuthenticationPayload> {
    const existsByEmail = await this.userService.existsByEmail(email);

    if (existsByEmail) {
      throw new UnauthorizedException(ExceptionMessageCode.USER_EMAIL_EXISTS);
    }

    const hashedPassword = await this.passwordEncoder.encode(password);

    const user = await this.userService.create({
      email,
      gender,
      userName,
      passwordHash: hashedPassword,
    });

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    return { accessToken, refreshToken, hasEmailVerified: false };
  }

  async signInWithToken(params: SignInParams): Promise<AuthenticationPayload> {
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
      this.jwtHelper.generateAuthenticationTokens({
        userId: user.id,
      });

    await this.userService.addRefreshTokenByUserId(user.id, refreshToken);

    const hasEmailVerified =
      await this.accountVerificationService.getIsVerifiedByUserId(user.id);

    return { accessToken, refreshToken, hasEmailVerified };
  }

  async refreshToken(oldRefreshToken: string): Promise<AuthenticationPayload> {
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
