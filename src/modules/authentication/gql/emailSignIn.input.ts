import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { IsEmailCustom } from '@shared/validator';

@InputType()
export class EmailSignInInput {
  @Field()
  @IsString()
  @IsEmailCustom()
  @MaxLength(255)
  readonly email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
