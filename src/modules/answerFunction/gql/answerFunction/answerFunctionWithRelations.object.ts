import { Field, ObjectType } from '@nestjs/graphql';

import { AnswerFunctionObject } from './answerFunction.object';
import { MathSubFieldObject } from '../../../mathSubField/gql/mathSubField/mathSubField.object copy';

@ObjectType()
export class AnswerFunctionWithRelationsObject extends AnswerFunctionObject {
  @Field(() => MathSubFieldObject, { nullable: true })
  mathSubField?: MathSubFieldObject | null;
}
