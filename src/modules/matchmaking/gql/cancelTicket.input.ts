import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CancelTicketInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  concurrencyTimestamp: string;
}
