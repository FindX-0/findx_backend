import { Module } from '@nestjs/common';
import { RefreshTokenRepository } from './refreshToken.repository';
import { RefreshTokenService } from './refreshToken.service';

@Module({
  providers: [RefreshTokenRepository, RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
