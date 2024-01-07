import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GenerateNewMathProblemValuesInput {
  @Field()
  template: string;

  @Field(() => [GenerateNewMathProblemNumberParameterInput])
  numberParams: GenerateNewMathProblemNumberParameterInput[];

  @Field(() => [GenerateNewMathProblemCustomStrParameterInput])
  customStrParams: GenerateNewMathProblemCustomStrParameterInput[];

  @Field(() => ID)
  mathFieldId: string;

  @Field(() => ID)
  mathSubFieldId: string;
}

@InputType()
export class GenerateNewMathProblemNumberParameterInput {
  @Field(() => Int)
  index: number;

  @Field(() => Int)
  min: number;

  @Field(() => Int)
  max: number;

  @Field(() => Float)
  step: number;
}

@InputType()
export class GenerateNewMathProblemCustomStrParameterInput {
  @Field(() => Int)
  index: number;

  @Field()
  values: string;
}
