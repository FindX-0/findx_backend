import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServerTimeObject {
  @Field()
  serverTime: Date;
}
