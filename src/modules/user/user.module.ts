import { Module } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { RefreshTokenModule } from '../refreshToken/refreshToken.module';

@Module({
  imports: [RefreshTokenModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
