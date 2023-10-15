import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../user';

export class SignUpBodyDto {
  @IsString()
  @MaxLength(255)
  @MinLength(2)
  readonly userName: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender: Gender;

  @IsString()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
