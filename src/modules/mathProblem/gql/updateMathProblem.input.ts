import { Field, Float, ID, InputType } from '@nestjs/graphql';
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

import { IdentifierInput } from '@shared/gql';

import { CreateMathProblemAnswerInput } from './createMathProblemAnswer.input';

@InputType()
export class UpdateMathProblemInput extends IdentifierInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  difficulty: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tex: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mathFieldId: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mathSubFieldId: string | null;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  imageMediaIds: string[] | null;

  @Field(() => [CreateMathProblemAnswerInput], { nullable: true })
  @Type(() => CreateMathProblemAnswerInput)
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  answers: CreateMathProblemAnswerInput[] | null;
}
