import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IdentifierInput } from '@shared/gql';

@InputType()
export class UpdateMathFieldInput extends IdentifierInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  spamDelayMillis: number | null;
}
