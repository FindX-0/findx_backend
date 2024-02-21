import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerObject } from './mathProblemAnswer.object';
import { MathProblemBaseObject } from './mathProblemBase.object';
import { MathFieldObject } from '../../../mathField/gql/mathField.object';
import { MathSubFieldWithRelationsObject } from '../../../mathSubField/gql/mathSubField/mathSubFieldWithRelations.object';
import { MediaFileObject } from '../../../mediaFile/gql/mediaFile.object';

@ObjectType()
export class MathProblemObject extends MathProblemBaseObject {
  @Field(() => [MediaFileObject], { nullable: true })
  images: MediaFileObject[] | null;

  @Field(() => [MathProblemAnswerObject])
  answers: MathProblemAnswerObject[];

  @Field(() => MathFieldObject, { nullable: true })
  mathField?: MathFieldObject | null;

  @Field(() => MathSubFieldWithRelationsObject, { nullable: true })
  mathSubField?: MathSubFieldWithRelationsObject | null;
}
