import { Field, ID, ObjectType } from '@nestjs/graphql';

import { MathFieldObject } from '@modules/mathField/gql/mathField.object';

@ObjectType()
export class MathSubFieldObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  name: string;

  @Field()
  mathFieldId: string;

  @Field(() => MathFieldObject)
  mathField?: MathFieldObject;
}
