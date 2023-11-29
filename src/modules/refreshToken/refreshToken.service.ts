import { Injectable } from '@nestjs/common';

import { NewRefreshToken, SelectableRefreshToken } from './refreshToken.entity';
import { RefreshTokenRepository } from './refreshToken.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  create(params: NewRefreshToken): Promise<SelectableRefreshToken | null> {
    return this.refreshTokenRepository.create(params);
  }

  getUserIdByValue(value: string): Promise<string | null> {
    return this.refreshTokenRepository.getUserIdByValue(value);
  }

  getAdminUserIdByValue(value: string): Promise<string | null> {
    return this.refreshTokenRepository.getAdminUserIdByValue(value);
  }

  deleteAllByUserId(userId: string): Promise<void> {
    return this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  deleteAllByAdminUserId(adminUserId: string) {
    return this.refreshTokenRepository.deleteAllByAdminUserId(adminUserId);
  }

  deleteByValue(value: string): Promise<void> {
    return this.refreshTokenRepository.deleteByValue(value);
  }
}
