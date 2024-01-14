import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerObject } from './mathProblemAnswer.object';
import { MathProblemBaseObject } from './mathProblemBase.object';
import { MathFieldObject } from '../../../mathField/gql/mathField.object';
import { MathSubFieldObject } from '../../../mathSubField/gql/mathSubField.object';
import { MediaFileObject } from '../../../mediaFile/gql/mediaFile.object';

@ObjectType()
export class MathProblemObject extends MathProblemBaseObject {
  @Field(() => [MediaFileObject], { nullable: true })
  images: MediaFileObject[] | null;

  @Field(() => [MathProblemAnswerObject])
  answers: MathProblemAnswerObject[];

  @Field(() => MathFieldObject, { nullable: true })
  mathField?: MathFieldObject | null;

  @Field(() => MathSubFieldObject, { nullable: true })
  mathSubField?: MathSubFieldObject | null;
}
