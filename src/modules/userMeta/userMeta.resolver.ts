import { Query, Resolver } from '@nestjs/graphql';

import { UserMetaObject } from './gql/userMeta.object';
import { UserMetaQueryService } from './userMetaQuery.service';
import { HttpAuthPayload } from '../authentication/filter/httpAuthPayload.interceptor';
import { UserAuthPayload } from '../authentication/type/userAuthPayload.type';

@Resolver()
export class UserMetaResolver {
  constructor(private readonly userMetaQueryService: UserMetaQueryService) {}

  @Query(() => UserMetaObject)
  async getAuthUserMeta(
    @HttpAuthPayload() authPayload: UserAuthPayload,
  ): Promise<UserMetaObject> {
    return this.userMetaQueryService.getByUserId(authPayload.userId);
  }
}
