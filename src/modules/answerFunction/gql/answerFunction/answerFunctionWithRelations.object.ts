import { Field, ObjectType } from '@nestjs/graphql';

import { AnswerFunctionObject } from './answerFunction.object';
import { MathSubFieldObject } from '../../../mathSubField/gql/mathSubField.object';

@ObjectType()
export class AnswerFunctionWithRelations extends AnswerFunctionObject {
  @Field(() => MathSubFieldObject, { nullable: true })
  mathSubField?: MathSubFieldObject | null;
}
