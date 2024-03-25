import { Module } from '@nestjs/common';

import { CreateUser } from './usecase/createUser.usecase';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserValidator } from './user.validator';
import { UserMutationService } from './userMutation.service';
import { UserQueryService } from './userQuery.service';
import { UserMetaModule } from '../userMeta/userMeta.module';

@Module({
  imports: [UserMetaModule],
  providers: [
    UserMutationService,
    UserQueryService,
    UserRepository,
    UserValidator,
    UserResolver,
    CreateUser,
  ],
  exports: [UserMutationService, UserValidator, UserQueryService, CreateUser],
})
export class UserModule {}
