import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateAnswerFunctionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  func: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  condition: string | null;

  @Field()
  @IsNumber()
  @Min(0)
  @Max(50)
  weight: number;
}
