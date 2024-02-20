import { Field, ID, ObjectType } from '@nestjs/graphql';

import { NumberType } from '../../../../entities';

@ObjectType()
export class AnswerFunctionObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  func: string;

  @Field(() => String, { nullable: true })
  condition: string | null;

  @Field()
  weight: string;

  @Field()
  numberType: NumberType;

  @Field(() => ID)
  mathSubFieldId: string;
}
