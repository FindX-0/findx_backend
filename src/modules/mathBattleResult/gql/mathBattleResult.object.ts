import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathBattleResultObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  matchId: string;

  @Field()
  score: number;

  @Field()
  isWinner: boolean;

  @Field()
  isDraw: boolean;

  @Field()
  trophyChange: number;
}
