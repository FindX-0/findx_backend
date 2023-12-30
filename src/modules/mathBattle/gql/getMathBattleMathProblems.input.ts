import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetMathBattleMathProblemsInput {
  @Field(() => ID)
  matchId: string;
}
