import { Module } from '@nestjs/common';

import { RefreshTokenModule } from '@modules/refreshToken';

import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserValidator } from './user.validator';

@Module({
  imports: [RefreshTokenModule],
  providers: [UserService, UserRepository, UserValidator],
  exports: [UserService, UserValidator],
})
export class UserModule {}
