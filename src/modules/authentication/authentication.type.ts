import { Gender } from '@entities/entityEnums';

export type SignUpWithTokenParams = {
  readonly userName: string;
  readonly email: string;
  readonly gender: Gender;
  readonly password: string;
};

export type SignInParams = {
  readonly email: string;
  readonly password: string;
};

export type RecoverPasswordConfirmCodeParams = {
  readonly code: number;
  readonly email: string;
};

export type RecoverPasswordParams = {
  readonly uuid: string;
  readonly password: string;
};

export type AuthenticationPayload = {
  accessToken: string;
  refreshToken: string;
  hasEmailVerified?: boolean;
};
