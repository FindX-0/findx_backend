import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetMathBattleResultsInput {
  @Field(() => ID)
  matchId: string;
}
