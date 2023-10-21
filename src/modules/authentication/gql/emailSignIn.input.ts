import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class EmailSignInInput {
  @Field()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
