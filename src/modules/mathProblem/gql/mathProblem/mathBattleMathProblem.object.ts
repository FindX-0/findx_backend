import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerWoutCorrectObject } from './mathProblemAnswerWoutCorrect.object';
import { MathProblemBaseObject } from './mathProblemBase.object';

@ObjectType()
export class MathBattleMathProblemObject extends MathProblemBaseObject {
  @Field(() => [MathProblemAnswerWoutCorrectObject])
  answers: MathProblemAnswerWoutCorrectObject[];
}
