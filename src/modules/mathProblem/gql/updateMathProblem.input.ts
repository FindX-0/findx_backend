import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mathFieldId: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mathSubFieldId: string | null;
}
