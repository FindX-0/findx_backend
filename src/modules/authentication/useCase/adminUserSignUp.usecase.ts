import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Role } from '@entities/index';
import { CreateAdminUserUseCase } from '@modules/adminUser/useCase/createAdminUser.usecase';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthTokenPayload } from '../authentication.type';
import { JwtHelper } from '../util/jwt.helper';
import { PasswordEncoder } from '../util/password.encoder';

type Values = {
  email: string;
  password: string;
  userName: string;
};

@Injectable()
export class AdminUserSignUpUseCase {
  constructor(
    private readonly createAdminUserUseCase: CreateAdminUserUseCase,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call({ userName, email, password }: Values): Promise<AuthTokenPayload> {
    const hashedPassword = await this.passwordEncoder.encode(password);

    const user = await this.createAdminUserUseCase.call({
      email,
      userName,
      passwordHash: hashedPassword,
      roles: [Role.SUPER_ADMIN],
    });

    if (!user) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_ADMIN_USER,
      );
    }

    const { accessToken, refreshToken } =
      this.jwtHelper.generateAdminAuthTokens({ userId: user.id });

    await this.refreshTokenService.create({
      adminUserId: user.id,
      value: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
