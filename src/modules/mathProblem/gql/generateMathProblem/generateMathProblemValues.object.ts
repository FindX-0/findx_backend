import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerObject } from '../mathProblem/mathProblemAnswer.object';

@ObjectType()
export class GenerateMathProblemValuesObject {
  @Field(() => [MathProblemAnswerObject], { nullable: true })
  answers: MathProblemAnswerObject[] | null;

  @Field()
  tex: string;
}
