import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMathSubFieldInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  mathFieldId: string;
}
