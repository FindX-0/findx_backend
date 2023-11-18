import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class IdentifierInput {
  @Field(() => ID)
  id: string;
}
