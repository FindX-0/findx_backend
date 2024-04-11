import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeclineFriendRequestInput {
  @Field(() => ID)
  @IsNotEmpty()
  userId: string;
}
