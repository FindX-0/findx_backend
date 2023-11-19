import { Module } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserValidator } from './user.validator';

@Module({
  providers: [UserService, UserRepository, UserValidator, UserResolver],
  exports: [UserService, UserValidator],
})
export class UserModule {}
