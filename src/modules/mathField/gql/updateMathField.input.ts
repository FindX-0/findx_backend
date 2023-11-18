import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IdentifierInput } from '@shared/gql';

@InputType()
export class UpdateMathFieldInput extends IdentifierInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string | null;
}
