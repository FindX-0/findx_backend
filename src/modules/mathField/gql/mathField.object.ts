import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathFieldObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;
}
