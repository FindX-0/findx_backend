import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateMathProblemInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
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
}
