import { Injectable } from '@nestjs/common';

import {
  NewRefreshToken,
  SelectableRefreshToken,
} from '@entities/refreshToken.entity';

import { RefreshTokenRepository } from './refreshToken.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async create(params: NewRefreshToken): Promise<SelectableRefreshToken> {
    return this.refreshTokenRepository.create(params);
  }

  async getUserIdByValue(value: string): Promise<string | null> {
    return this.refreshTokenRepository.getUserIdByValue(value);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    return this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  async deleteByValue(value: string): Promise<void> {
    return this.refreshTokenRepository.deleteByValue(value);
  }
}
