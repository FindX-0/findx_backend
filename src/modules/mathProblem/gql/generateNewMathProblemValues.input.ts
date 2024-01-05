import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GenerateNewMathProblemValuesInput {
  @Field()
  template: string;

  @Field(() => [GenerateNewMathProblemNumberParameterInput])
  numberParams: GenerateNewMathProblemNumberParameterInput[];

  @Field(() => [GenerateNewMathProblemCustomStrParameterInput])
  customStrParams: GenerateNewMathProblemCustomStrParameterInput[];
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
