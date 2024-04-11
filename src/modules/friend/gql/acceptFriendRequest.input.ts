import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AcceptFriendRequestInput {
  @Field(() => ID)
  @IsNotEmpty()
  userId: string;
}
