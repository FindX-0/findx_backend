import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountObject {
  @Field(() => Int)
  count: number;
}
