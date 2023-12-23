import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { CreateMathProblemAnswerInput } from './createMathProblemAnswer.input';

@InputType()
export class CreateMathProblemInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  difficulty: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tex: string | null;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  mathFieldId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  mathSubFieldId: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  imageMediaIds: string[] | null;

  @Field(() => [CreateMathProblemAnswerInput])
  @Type(() => CreateMathProblemAnswerInput)
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  answers: CreateMathProblemAnswerInput[];
}
