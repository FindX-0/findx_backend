import { Field, ID, ObjectType } from '@nestjs/graphql';

import { FriendshipStatus } from '../../../../entities';

@ObjectType()
export class FriendObject {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  friendId: string;

  @Field()
  createdAt: Date;

  @Field()
  status: FriendshipStatus;
}
