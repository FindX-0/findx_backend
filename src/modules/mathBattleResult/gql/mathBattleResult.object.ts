import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Int)
  score: number;

  @Field()
  isWinner: boolean;

  @Field()
  isDraw: boolean;

  @Field(() => Int)
  trophyChange: number;
}
