import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EnvService } from '@config/env';

import { JwtPayload } from '../type/jwtPayload.type';
import { UserAuthPayload } from '../type/userAuthPayload.type';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  generateAuthenticationTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessTokenExp = this.envService.get('ACCESS_TOKEN_EXPIRATION');
    const accessTokenSecret = this.envService.get('ACCESS_TOKEN_SECRET');

    const refreshTokenExp = this.envService.get('REFRESH_TOKEN_EXPIRATION');
    const refreshTokenSecret = this.envService.get('REFRESH_TOKEN_SECRET');

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessTokenExp,
        secret: accessTokenSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshTokenExp,
        secret: refreshTokenSecret,
      }),
    };
  }

  getUserPayload(jwtToken: string): UserAuthPayload | null {
    const payload = this.jwtService.decode(jwtToken);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload?.['userId'] !== 'string' ||
      typeof payload?.['iat'] !== 'number' ||
      typeof payload?.['exp'] !== 'number'
    ) {
      return null;
    }

    return {
      userId: payload['userId'],
      issuedAt: payload['iat'],
      expirationTime: payload['exp'],
    };
  }

  async isRefreshTokenValid(token: string): Promise<boolean> {
    return this.isJwtTokenValid({
      token,
      secret: this.envService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async isAccessTokenValid(token: string): Promise<boolean> {
    return this.isJwtTokenValid({
      token,
      secret: this.envService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  private async isJwtTokenValid({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }): Promise<boolean> {
    if (!token) {
      return false;
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret,
        ignoreExpiration: false,
      });

      return true;
    } catch (_) {}

    return false;
  }
}
