import { Field, ID, InputType } from '@nestjs/graphql';

import { GenerateMathProblemValuesInputParams } from './generateMathProblemParams.input';

@InputType()
export class GenerateMathProblemValuesInput extends GenerateMathProblemValuesInputParams {
  @Field()
  template: string;

  @Field(() => ID)
  mathFieldId: string;

  @Field(() => ID)
  mathSubFieldId: string;
}
