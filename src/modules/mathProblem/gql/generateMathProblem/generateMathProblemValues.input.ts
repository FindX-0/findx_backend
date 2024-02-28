import { Field, ID, InputType } from '@nestjs/graphql';

import { GenerateMathProblemValuesInputParams } from './generateMathProblemParams.input';

@InputType()
export class GenerateMathProblemValuesInput extends GenerateMathProblemValuesInputParams {
  @Field()
  template: string;

  @Field(() => ID)
  mathSubFieldId: string;

  @Field(() => String, { nullable: true })
  answerConditionFunc: string | null;

  @Field(() => String, { nullable: true })
  correctAnswerConditionFunc: string | null;
}
