import { Field, InputType } from '@nestjs/graphql';

import { CreateMathProblemInput } from './createMathProblem.input';

@InputType()
export class BulkCreateMathProblemInput {
  @Field(() => [CreateMathProblemInput])
  values: CreateMathProblemInput[];
}
