import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { IsEmailCustom } from '@shared/validator';

@InputType()
export class EmailSignUpInput {
  @Field()
  @IsString()
  @MaxLength(255)
  @MinLength(2)
  readonly userName: string;

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
