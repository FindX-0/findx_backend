import { Query, Resolver } from '@nestjs/graphql';

import { UserObject } from './gql';
import { UserQueryService } from './userQuery.service';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

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
