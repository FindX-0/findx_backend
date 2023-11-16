import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class EnqueueTicketInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  mathFieldId: string;
}
