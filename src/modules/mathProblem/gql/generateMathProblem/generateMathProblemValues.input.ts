import { Field, InputType } from '@nestjs/graphql';

import { GenerateMathProblemValuesInputParams } from './generateMathProblemParams.input';

@InputType()
export class GenerateMathProblemValuesInput extends GenerateMathProblemValuesInputParams {
  @Field()
  template: string;
}
