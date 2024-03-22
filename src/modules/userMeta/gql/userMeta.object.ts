import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserMetaObject {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  trophies: number;

  @Field(() => ID)
  userId: string;
}
