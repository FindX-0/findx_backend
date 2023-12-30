import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerObject } from './mathProblemAnswer.object';
import { MathProblemBaseObject } from './mathProblemBase.object';
import { MathFieldObject } from '../../../mathField/gql/mathField.object';
import { MathSubFieldObject } from '../../../mathSubField/gql/mathSubField.object';

@ObjectType()
export class MathProblemObject extends MathProblemBaseObject {
  @Field(() => [MathProblemAnswerObject])
  answers: MathProblemAnswerObject[];

  @Field(() => MathFieldObject, { nullable: true })
  mathField?: MathFieldObject | null;

  @Field(() => MathSubFieldObject, { nullable: true })
  mathSubField?: MathSubFieldObject | null;
}
