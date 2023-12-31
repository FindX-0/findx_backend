import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { AuthProvider } from '@entities/index';
import { RefreshTokenService } from '@modules/refreshToken/refreshToken.service';
import { SelectableUser } from '@modules/user/user.entity';
import { UserMutationService } from '@modules/user/userMutation.service';
import { UserQueryService } from '@modules/user/userQuery.service';
import { ExceptionMessageCode } from '@shared/constant';

import {
  AuthenticationPayload,
  DeviceSignInParams,
} from '../authentication.type';
import { JwtHelper } from '../util/jwt.helper';

@Injectable()
export class DeviceSignInUseCase {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userMutationService: UserMutationService,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async call(params: DeviceSignInParams): Promise<AuthenticationPayload> {
    const user = await this.getOrCreateUser(params);

    const { accessToken, refreshToken } = this.jwtHelper.generateAuthTokens({
      userId: user.id,
    });

    await this.refreshTokenService.create({
      userId: user.id,
      value: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  private async getOrCreateUser({
    deviceId,
  }: DeviceSignInParams): Promise<SelectableUser> {
    const user = await this.userQueryService.getByDeviceId(deviceId);

    if (user) {
      return user;
    }

    const newUser = await this.userMutationService.create({
      authProvider: AuthProvider.NONE,
      isCompleted: true,
      deviceId,
      email: null,
      passwordHash: null,
      userName: null,
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        ExceptionMessageCode.COULD_NOT_CREATE_USER,
      );
    }

    return newUser;
  }
}
