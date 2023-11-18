import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EnvService } from '@config/env';

import { AuthTokenPayload } from '../authentication.type';
import { JwtPayload } from '../type/jwtPayload.type';
import { UserAuthPayload } from '../type/userAuthPayload.type';

type ValidateJwtOptions = {
  ignoreExpiration: boolean;
};

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  generateAuthTokens(payload: Omit<JwtPayload, 'isAdmin'>): AuthTokenPayload {
    const fullPayload: JwtPayload = { ...payload, isAdmin: false };

    return {
      accessToken: this.jwtService.sign(fullPayload, {
        expiresIn: this.envService.get('ACCESS_TOKEN_EXPIRATION'),
        secret: this.envService.get('ACCESS_TOKEN_SECRET'),
      }),
      refreshToken: this.jwtService.sign(fullPayload, {
        expiresIn: this.envService.get('REFRESH_TOKEN_EXPIRATION'),
        secret: this.envService.get('REFRESH_TOKEN_SECRET'),
      }),
    };
  }

  generateAdminAuthTokens(
    payload: Omit<JwtPayload, 'isAdmin'>,
  ): AuthTokenPayload {
    const fullPayload: JwtPayload = { ...payload, isAdmin: true };

    return {
      accessToken: this.jwtService.sign(fullPayload, {
        expiresIn: this.envService.get('ACCESS_TOKEN_EXPIRATION'),
        secret: this.envService.get('ADMIN_ACCESS_TOKEN_SECRET'),
      }),
      refreshToken: this.jwtService.sign(fullPayload, {
        expiresIn: this.envService.get('REFRESH_TOKEN_EXPIRATION'),
        secret: this.envService.get('ADMIN_REFRESH_TOKEN_SECRET'),
      }),
    };
  }

  getUserPayload(jwtToken: string): UserAuthPayload | null {
    const payload = this.jwtService.decode(jwtToken);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload?.['userId'] !== 'string' ||
      typeof payload?.['isAdmin'] !== 'boolean' ||
      typeof payload?.['iat'] !== 'number' ||
      typeof payload?.['exp'] !== 'number'
    ) {
      return null;
    }

    return {
      userId: payload['userId'],
      isAdmin: payload['isAdmin'],
      issuedAt: payload['iat'],
      expirationTime: payload['exp'],
    };
  }

  async isRefreshTokenValid(
    token: string,
    options?: ValidateJwtOptions,
  ): Promise<boolean> {
    return this.isJwtTokenValid({
      token,
      ...(options && { options }),
      secret: this.envService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async isAccessTokenValid(
    token: string,
    options?: ValidateJwtOptions,
  ): Promise<boolean> {
    return this.isJwtTokenValid({
      token,
      ...(options && { options }),
      secret: this.envService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  private async isJwtTokenValid({
    token,
    options,
    secret,
  }: {
    token: string;
    options?: ValidateJwtOptions;
    secret: string;
  }): Promise<boolean> {
    if (!token) {
      return false;
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret,
        ignoreExpiration: options?.ignoreExpiration ?? false,
      });

      return true;
    } catch (_) {}

    return false;
  }
}
