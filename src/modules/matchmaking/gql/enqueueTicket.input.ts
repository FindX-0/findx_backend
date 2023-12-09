import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class EnqueueTicketInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  mathFieldId: string;
}
