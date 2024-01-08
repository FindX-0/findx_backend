import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export abstract class GenerateMathProblemValuesInputParams {
  @Field(() => [GenerateMathProblemNumberParameterInput])
  numberParams: GenerateMathProblemNumberParameterInput[];

  @Field(() => [GenerateMathProblemCustomStrParameterInput])
  customStrParams: GenerateMathProblemCustomStrParameterInput[];
}

@InputType()
export class GenerateMathProblemNumberParameterInput {
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
export class GenerateMathProblemCustomStrParameterInput {
  @Field(() => Int)
  index: number;

  @Field()
  values: string;
}
