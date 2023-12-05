import { Query, Resolver } from '@nestjs/graphql';

import { HttpAuthPayload, UserAuthPayload } from '@modules/authentication';

import { UserObject } from './gql';
import { UserQueryService } from './userQuery.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userQueryService: UserQueryService) {}

  @Query(() => UserObject)
  async getAuthUser(
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<UserObject> {
    return this.userQueryService.getById(authPayload.userId);
  }
}
