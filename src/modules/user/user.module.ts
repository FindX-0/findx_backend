import { Module } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserValidator } from './user.validator';
import { UserMutationService } from './userMutation.service';
import { UserQueryService } from './userQuery.service';

@Module({
  providers: [
    UserMutationService,
    UserQueryService,
    UserRepository,
    UserValidator,
    UserResolver,
  ],
  exports: [UserMutationService, UserValidator, UserQueryService],
})
export class UserModule {}
