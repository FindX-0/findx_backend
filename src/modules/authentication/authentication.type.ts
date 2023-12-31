export type SignUpWithTokenParams = {
  readonly userName: string;
  readonly email: string;
  readonly password: string;
};

export type EmailSignInParams = {
  readonly email: string;
  readonly password: string;
};

export type DeviceSignInParams = {
  readonly deviceId: string;
};

export type RecoverPasswordConfirmCodeParams = {
  readonly code: number;
  readonly email: string;
};

export type RecoverPasswordParams = {
  readonly uuid: string;
  readonly password: string;
};

export type AuthTokenPayload = {
  accessToken: string;
  refreshToken: string;
};

export type AuthenticationPayload = AuthTokenPayload & {
  hasEmailVerified?: boolean;
};
