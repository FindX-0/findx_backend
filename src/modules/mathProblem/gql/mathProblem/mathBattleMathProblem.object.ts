import { Field, ObjectType } from '@nestjs/graphql';

import { MathProblemAnswerWoutCorrectObject } from './mathProblemAnswerWoutCorrect.object';
import { MathProblemBaseObject } from './mathProblemBase.object';
import { MediaFileObject } from '../../../mediaFile/gql/mediaFile.object';

@ObjectType()
export class MathBattleMathProblemObject extends MathProblemBaseObject {
  @Field(() => [MediaFileObject], { nullable: true })
  images: MediaFileObject[] | null;

  @Field(() => [MathProblemAnswerWoutCorrectObject])
  answers: MathProblemAnswerWoutCorrectObject[];
}
