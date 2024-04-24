import { Field, ObjectType } from '@nestjs/graphql';

import { UserObject } from './user.object';
import { FriendshipStatus } from '../../../entities';

@ObjectType()
export class UserWithFriendshipStatusObject extends UserObject {
  @Field(() => FriendshipStatus, { nullable: true })
  friendshipStatus: FriendshipStatus | null;
}
