import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SubmitMathProblemAnswerInput {
  @Field(() => ID)
  matchId: string;

  @Field(() => ID)
  mathProblemId: string;

  @Field()
  answer: string;
}
