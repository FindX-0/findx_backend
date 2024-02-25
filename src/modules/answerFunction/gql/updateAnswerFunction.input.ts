import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IdentifierInput } from '@shared/gql';

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

  @Field(() => ID, { nullable: true })
  mathSubFieldId: string | null;
}
