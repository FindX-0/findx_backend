import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class AdminSignUpInput {
  @Field()
  @IsString()
  @MaxLength(255)
  @MinLength(2)
  readonly userName: string;

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
