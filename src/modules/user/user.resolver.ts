import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthPayload, UserAuthPayload } from '@modules/authentication';

import { UserType } from './gql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  async getAuthUser(
    @GqlAuthPayload() authPayload: UserAuthPayload,
  ): Promise<UserType> {
    return this.userService.getById(authPayload.userId);
  }
}
