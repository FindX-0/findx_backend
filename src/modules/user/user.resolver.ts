import { Args, Query, Resolver } from '@nestjs/graphql';

import { FilterUsersArgs } from './gql/filterUsers.input';
import { UserWithFriendshipStatusPageObject } from './gql/userWithFriendshipStatusPage.object';
import { UserWithRelationsObject } from './gql/userWithRelations.object';
import { UserQueryService } from './userQuery.service';
import { IdentifierInput } from '../../shared/gql';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class UserResolver {
  constructor(private readonly userQueryService: UserQueryService) {}

  @Query(() => UserWithRelationsObject)
  async getAuthUser(
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<UserWithRelationsObject> {
    return this.userQueryService.getById(authPayload.userId);
  }

  @Query(() => UserWithRelationsObject)
  async getUserById(
    @Args('input') input: IdentifierInput,
  ): Promise<UserWithRelationsObject> {
    return this.userQueryService.getById(input.id);
  }

  @Query(() => UserWithFriendshipStatusPageObject)
  async filterUsers(
    @HttpAuthPayload() authPayload: UserAuthPayload,
    @Args('input') input: FilterUsersArgs,
  ): Promise<UserWithFriendshipStatusPageObject> {
    return this.userQueryService.filter({
      authUserId: authPayload.userId,
      ...input,
    });
  }
}
