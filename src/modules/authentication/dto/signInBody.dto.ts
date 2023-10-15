import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInBodyDto {
  @IsString()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
