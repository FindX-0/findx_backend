import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { MathFieldObject } from '@modules/mathField/gql/mathField.object';
import { MathSubFieldObject } from '@modules/mathSubField/gql/mathSubField.object';
import { MediaFileObject } from '@modules/mediaFile/gql/mediaFile.object';

@ObjectType()
export class MathProblemObject {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  difficulty: number;

  @Field(() => String, { nullable: true })
  text: string | null;

  @Field(() => String, { nullable: true })
  tex: string | null;

  @Field()
  mathFieldId: string;

  @Field()
  mathSubFieldId: string;

  @Field(() => [MediaFileObject], { nullable: true })
  images: MediaFileObject[] | null;

  @Field(() => MathFieldObject, { nullable: true })
  mathField?: MathFieldObject | null;

  @Field(() => MathSubFieldObject, { nullable: true })
  mathSubField?: MathSubFieldObject | null;
}
