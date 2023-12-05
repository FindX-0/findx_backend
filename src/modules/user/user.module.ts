import { Module } from '@nestjs/common';

import { RandomGenerator } from '@shared/util';

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
    RandomGenerator,
  ],
  exports: [UserMutationService, UserValidator, UserQueryService],
})
export class UserModule {}
