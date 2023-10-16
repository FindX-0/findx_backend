import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Gender } from '../../user';

@InputType()
export class SignUpInputDto {
  @Field()
  @IsString()
  @MaxLength(255)
  @MinLength(2)
  readonly userName: string;

  @Field(() => Gender)
  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender: Gender;

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
