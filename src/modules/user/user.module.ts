import { Module } from '@nestjs/common';

import { CreateUser } from './usecase/createUser.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserValidator } from './user.validator';
import { UserMetaRepository } from './userMeta/userMeta.repository';
import { UserMetaMutationService } from './userMeta/userMetaMutation.service';
import { UserMutationService } from './userMutation.service';
import { UserQueryService } from './userQuery.service';

@Module({
  providers: [
    // userMeta
    UserMetaRepository,
    UserMetaMutationService,

    // user
    UserMutationService,
    UserQueryService,
    UserRepository,
    UserValidator,
    UserResolver,
    CreateUser,
  ],
  exports: [
    // userMeta
    UserMetaMutationService,
    // user
    UserMutationService,
    UserValidator,
    UserQueryService,
    CreateUser,
  ],
})
export class UserModule {}
