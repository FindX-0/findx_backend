import { Field, ID, ObjectType } from '@nestjs/graphql';

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
}
