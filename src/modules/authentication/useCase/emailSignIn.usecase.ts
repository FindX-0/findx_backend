import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { ExceptionMessageCode } from '@shared/constant';
import { AccountVerificationService } from '@modules/accountVerification/accountVerification.service';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { UserQueryService } from '@modules/user/userQuery.service';

import {
  AuthenticationPayload,
  EmailSignInParams,
} from '../authentication.type';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

@Injectable()
export class EmailSignInUseCase {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly accountVerificationService: AccountVerificationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call(params: EmailSignInParams): Promise<AuthenticationPayload> {
    const user = await this.userQueryService.getByEmail(params.email);

    if (!user) {
      throw new UnauthorizedException(
        ExceptionMessageCode.EMAIL_OR_PASSWORD_INVALID,
      );
    }

    if (!user.passwordHash) {
      throw new InternalServerErrorException(ExceptionMessageCode.INVALID_USER);
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
