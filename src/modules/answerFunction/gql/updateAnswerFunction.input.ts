import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IdentifierInput } from '@shared/gql';

import { NumberType } from '../../../entities';

@InputType()
export class UpdateAnswerFunctionInput extends IdentifierInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  func: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  condition: string | null;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  weight: number | null;

  @Field(() => NumberType, { nullable: true })
  @IsOptional()
  @IsEnum(NumberType)
  numberType: NumberType | null;
}
