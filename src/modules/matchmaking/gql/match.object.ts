import { Field, ID, ObjectType } from '@nestjs/graphql';

import { MatchState } from '../../../entities';

@ObjectType()
export class MatchObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  startAt: Date;

  @Field()
  endAt: Date;

  @Field()
  closeAt: Date;

  @Field()
  state: MatchState;

  @Field()
  mathFieldId: string;

  @Field(() => [String])
  userIds: string[];

  @Field(() => [String])
  mathProblemIds: string[];
}
