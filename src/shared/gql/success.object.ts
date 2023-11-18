import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuccessObject {
  @Field()
  success: boolean;
}
