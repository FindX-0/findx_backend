import { Module } from '@nestjs/common';

import { RefreshTokenModule } from '@modules/refreshToken';

import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [RefreshTokenModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
