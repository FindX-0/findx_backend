import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenBodyDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
