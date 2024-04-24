import { ObjectType } from '@nestjs/graphql';

import { DataPageObject } from '@shared/gql';

import { UserWithFriendshipStatusObject } from './userWithFriendshipStatus.object';

@ObjectType()
export class UserWithFriendshipStatusPageObject extends DataPageObject(
  UserWithFriendshipStatusObject,
) {}
