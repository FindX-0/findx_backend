import { Module } from '@nestjs/common';

import { CreateUser } from './usecase/createUser.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserValidator } from './user.validator';
import { UserMutationService } from './userMutation.service';
import { UserQueryService } from './userQuery.service';
import { UserMetaRepository } from '../userMeta/userMeta.repository';
import { UserMetaMutationService } from '../userMeta/userMetaMutation.service';
import { UserMetaQueryService } from '../userMeta/userMetaQuery.service';

@Module({
  providers: [
    // userMeta
    UserMetaRepository,
    UserMetaMutationService,
    UserMetaQueryService,
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
    UserMetaQueryService,
    // user
    UserMutationService,
    UserValidator,
    UserQueryService,
    CreateUser,
  ],
})
export class UserModule {}
