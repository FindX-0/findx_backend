import { Field, ObjectType } from '@nestjs/graphql';

import { FriendObject } from './friend.object';
import { UserObject } from '../../../user/gql/user.object';

@ObjectType()
export class FriendWithRelationsObject extends FriendObject {
  @Field(() => UserObject, { nullable: true })
  user: UserObject | null;

  @Field(() => UserObject, { nullable: true })
  friend: UserObject | null;
}
