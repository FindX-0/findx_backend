import { Field, ID, ObjectType } from '@nestjs/graphql';

import { TicketState } from '../../../entities';

@ObjectType()
export class TicketObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => TicketState)
  state: TicketState;

  @Field(() => ID, { nullable: true })
  matchId: string | null;

  @Field(() => String, { nullable: true })
  concurrencyTimestamp: string | null;

  @Field(() => ID)
  mathFieldId: string;
}
