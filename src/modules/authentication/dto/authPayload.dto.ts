export class AuthPayloadResponseDto {
  readonly accessToken: string;

  readonly refreshToken: string;

  readonly hasEmailVerified?: boolean;
}
