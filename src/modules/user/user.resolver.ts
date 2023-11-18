import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthPayload, UserAuthPayload } from '@modules/authentication';

import { UserObject } from './gql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserObject)
  async getAuthUser(
    @GqlAuthPayload() authPayload: UserAuthPayload,
  ): Promise<UserObject> {
    return this.userService.getById(authPayload.userId);
  }
}
