import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MathFieldObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  isPublic: boolean;

  @Field(() => Int)
  spamDelayMillis: number;
}
