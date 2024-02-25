import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class GetAllAnswerFunctionsInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  mathSubFieldId: string | null;
}
