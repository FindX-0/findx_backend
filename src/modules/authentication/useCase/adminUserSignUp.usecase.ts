import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Role } from '@entities/entityEnums';
import { CreateAdminUserUseCase } from '@modules/adminUser';
import { RefreshTokenService } from '@modules/refreshToken';
import { ExceptionMessageCode } from '@shared/constant';

import { AuthTokenPayload } from '../authentication.type';
import { JwtHelper, PasswordEncoder } from '../util';

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
