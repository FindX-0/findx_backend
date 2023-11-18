import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServerTimeType {
  @Field()
  serverTime: number;
}
