import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IdentifierInput } from '@shared/gql';

@InputType()
export class UpdateMathProblemInput extends IdentifierInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
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
}
